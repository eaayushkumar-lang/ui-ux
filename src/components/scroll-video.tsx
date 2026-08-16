import { useEffect, useRef, useState } from "react";

interface ScrollVideoProps {
  src: string;
  /** Optional poster still. Omit to let the #f4eadd base show through
   * until the video has a decoded frame. */
  poster?: string;
}

// Frame-cache tuning (spec): up to 90 frames, or duration*12 (min 24);
// cached frames capped at 960px wide.
const MAX_FRAMES = 90;
const MIN_FRAMES = 24;
const FRAMES_PER_SECOND = 12;
const MAX_FRAME_WIDTH = 960;
const LERP = 0.12;
const SEEK_EPSILON = 0.04;
const EXTRACTION_DELAY_MS = 300;
const SEEK_TIMEOUT_MS = 4000; // a stalled seek must not hang extraction forever
const DURATION_PROBE_MS = 4000; // budget for forcing a real duration
const PLAYBACK_RATE = 2; // speed of the one-shot play-through extraction
const EXTRACTION_WATCHDOG_MS = 30000; // hard ceiling on the whole extraction

// requestVideoFrameCallback isn't in the DOM lib types yet.
type FrameMeta = { mediaTime: number };
type RVFCVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: (now: number, meta: FrameMeta) => void) => number;
};
function hasRVFC(v: HTMLVideoElement): v is RVFCVideo {
  return typeof (v as RVFCVideo).requestVideoFrameCallback === "function";
}

// Dev-only tracing. Silent in production builds (import.meta.env.DEV === false).
const DEBUG = Boolean(
  (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV,
);
function dlog(...args: unknown[]) {
  if (DEBUG) console.info("[ScrollVideo]", ...args);
}

/** object-cover: scale the source up to cover the dest, centre-crop. */
function coverRect(sw: number, sh: number, dw: number, dh: number) {
  const scale = Math.max(dw / sw, dh / sh);
  const w = sw * scale;
  const h = sh * scale;
  return { x: (dw - w) / 2, y: (dh - h) / 2, w, h };
}

/**
 * Resolve a usable duration for a media element. Many real MP4s report
 * `Infinity`/`NaN` for `duration` until the browser is nudged: seeking far
 * past the end forces it to parse to the last sample and emit `durationchange`
 * with the true value. Returns immediately when the duration is already finite
 * (the common, well-muxed case), so no visible jump happens there.
 */
function resolveDuration(v: HTMLVideoElement): Promise<number> {
  if (isFinite(v.duration) && v.duration > 0) return Promise.resolve(v.duration);
  return new Promise<number>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      v.removeEventListener("durationchange", onDur);
      v.removeEventListener("seeked", onSeek);
      clearTimeout(to);
      try {
        v.currentTime = 0; // rewind after the probe seek
      } catch {
        /* ignore */
      }
      resolve(isFinite(v.duration) && v.duration > 0 ? v.duration : NaN);
    };
    const onDur = () => {
      if (isFinite(v.duration) && v.duration > 0) finish();
    };
    const onSeek = () => finish();
    const to = setTimeout(finish, DURATION_PROBE_MS);
    v.addEventListener("durationchange", onDur);
    v.addEventListener("seeked", onSeek);
    try {
      v.currentTime = 1e7; // force parse-to-end
    } catch {
      finish();
    }
  });
}

/**
 * Fixed, full-bleed scroll-scrubbed video background. Page scroll maps to
 * the video timeline (smoothed with a lerp), rendered onto a canvas from a
 * pre-extracted ImageBitmap frame cache for jitter-free scrubbing. Until
 * the cache is ready it crossfades poster -> live video (seeked directly),
 * then poster/video -> canvas. The visible background is NEVER autoplayed as a
 * loop; its motion is scroll-driven only. (The frame cache is built from a
 * separate, hidden, one-shot play-through of an offscreen element - an
 * internal detail that never shows on screen.)
 *
 * The source file is fetched exactly ONCE as a blob, then the same in-memory
 * object URL feeds both the visible <video> and the offscreen frame extractor.
 * That single request keeps the two media loads from issuing competing range
 * requests for the same large file (which trips Chrome's disk cache:
 * net::ERR_CACHE_OPERATION_NOT_SUPPORTED) and makes the source same-origin so
 * createImageBitmap never taints.
 */
export function ScrollVideo({ src, poster }: ScrollVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [posterVisible, setPosterVisible] = useState(true);
  const [videoVisible, setVideoVisible] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  // Mutable render state kept in refs so the rAF loop never re-subscribes.
  const targetProgress = useRef(0);
  const smoothed = useRef(0);
  const frames = useRef<ImageBitmap[]>([]);
  const cacheReady = useRef(false);
  const hasFrame = useRef(false);
  const lastSeek = useRef(-1);
  // Resolved duration of the visible <video>, used by the seek fallback. Kept
  // separate from `video.duration` because that can be non-finite on real MP4s.
  const videoDuration = useRef(NaN);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;

    // Source resolution: the visible <video> and the offscreen extractor must
    // NOT both fetch the CloudFront URL directly - two concurrent range
    // requests for the same large file trip Chrome's disk cache
    // (net::ERR_CACHE_OPERATION_NOT_SUPPORTED) and one load fails. Instead we
    // download the file ONCE as a blob and hand the same in-memory object URL
    // to both consumers, so there is a single real network request. Bonus: a
    // blob URL is same-origin, so createImageBitmap never taints.
    let objectUrl: string | null = null;
    let extractionSource = src; // what buildCache's offscreen video loads
    let extractionNeedsCors = true; // only the direct-URL fallback needs CORS

    function sizeCanvas() {
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    function readScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      targetProgress.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    }
    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });

    // --- live video: first decoded frame reveals it + kicks off the cache ---
    function onLoadedData() {
      if (disposed) return;
      void onLoadedDataAsync();
    }
    async function onLoadedDataAsync() {
      hasFrame.current = true;
      if (!cacheReady.current) setVideoVisible(true);
      setPosterVisible(false);
      dlog("visible <video> loadeddata; raw duration =", video?.duration);
      // Resolve a usable duration so the seek fallback can engage even if the
      // frame cache isn't ready yet (or never becomes ready).
      videoDuration.current = await resolveDuration(video as HTMLVideoElement);
      dlog("visible <video> resolved duration =", videoDuration.current);
      if (disposed) return;
      // Yield, then extract the frame cache from a separate offscreen video.
      window.setTimeout(() => {
        if (!disposed) void buildCache();
      }, EXTRACTION_DELAY_MS);
    }
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("error", () =>
      dlog("visible <video> error:", video?.error?.code, video?.error?.message),
    );

    // Fetch the file exactly once, then point the visible <video> at the blob.
    // The offscreen extractor (buildCache) reuses the same object URL, so no
    // second network request is ever issued for the same asset.
    async function resolveSource() {
      // `video` is non-null here (guarded by the early return above); the
      // await below makes TS re-widen the closed-over ref, so re-narrow once.
      const el = video as HTMLVideoElement;
      try {
        dlog("resolveSource: fetching blob...");
        // cache:"reload" bypasses any half-written disk-cache entry; a
        // successful blob means we never touch the network a second time.
        const res = await fetch(src, { cache: "reload", mode: "cors" });
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        const blob = await res.blob();
        if (disposed) return;
        objectUrl = URL.createObjectURL(blob);
        extractionSource = objectUrl;
        extractionNeedsCors = false;
        el.src = objectUrl;
        dlog("resolveSource: blob ready", blob.size, "bytes ->", objectUrl.slice(0, 24) + "...");
      } catch (err) {
        // Blob path unavailable (CORS/network) - fall back to the direct URL.
        // This is the ONLY path that could still issue two requests, and only
        // when the browser refuses to hand us the blob at all.
        if (disposed) return;
        el.src = src;
        dlog("resolveSource: blob fetch failed, using direct URL. reason:", err);
      }
      el.load();
    }
    void resolveSource();

    // --- frame cache extraction (offscreen; reuses the resolved source) ----
    async function buildCache() {
      dlog(
        "buildCache: start; needsCors =",
        extractionNeedsCors,
        "source =",
        extractionSource.slice(0, 24) + "...",
      );
      const off = document.createElement("video") as RVFCVideo;
      off.src = extractionSource;
      if (extractionNeedsCors) off.crossOrigin = "anonymous";
      off.muted = true;
      off.playsInline = true;
      off.preload = "auto";
      // Attach (hidden) so the browser doesn't throttle decode/seek for a
      // DETACHED element - the prime suspect behind seeks that never fire
      // 'seeked' on large streams.
      off.setAttribute("aria-hidden", "true");
      off.style.cssText =
        "position:fixed;left:-10000px;top:0;width:2px;height:2px;opacity:0;pointer-events:none;";
      document.body.appendChild(off);

      const cleanupOff = () => {
        try {
          off.pause();
        } catch {
          /* ignore */
        }
        off.removeAttribute("src");
        try {
          off.load();
        } catch {
          /* ignore */
        }
        off.remove();
      };

      const bitmaps: (ImageBitmap | null)[] = [];
      try {
        await new Promise<void>((resolve, reject) => {
          off.addEventListener("loadedmetadata", () => resolve(), { once: true });
          off.addEventListener("error", () => reject(new Error("offscreen load error")), { once: true });
        });
        dlog(
          "buildCache: offscreen loadedmetadata; raw duration =",
          off.duration,
          "size =",
          `${off.videoWidth}x${off.videoHeight}`,
        );
        const duration = await resolveDuration(off);
        dlog("buildCache: resolved duration =", duration);
        if (!isFinite(duration) || duration <= 0) throw new Error("bad duration " + duration);

        const count = Math.max(MIN_FRAMES, Math.min(MAX_FRAMES, Math.round(duration * FRAMES_PER_SECOND)));
        const targets = Array.from({ length: count }, (_, i) => (i / (count - 1)) * (duration - 0.05));
        for (let i = 0; i < count; i++) bitmaps.push(null);

        const scratch = document.createElement("canvas");
        const sctx = scratch.getContext("2d");
        if (!sctx) throw new Error("no 2d context");

        // Capture the CURRENTLY displayed frame of `off` into slot `index`.
        // drawImage is synchronous so the pixels are grabbed at call time;
        // createImageBitmap then copies from that scratch canvas.
        const captureInto = async (index: number) => {
          const vw = off.videoWidth;
          const vh = off.videoHeight;
          if (!vw || !vh) throw new Error(`no dims ${vw}x${vh}`);
          const scale = Math.min(1, MAX_FRAME_WIDTH / vw);
          scratch.width = Math.round(vw * scale);
          scratch.height = Math.round(vh * scale);
          sctx.drawImage(off, 0, 0, scratch.width, scratch.height);
          bitmaps[index] = await createImageBitmap(scratch);
        };

        if (hasRVFC(off)) {
          dlog("buildCache: extracting", count, "frames via play-through (rVFC)");
          await extractByPlayback(off, targets, captureInto);
        } else {
          dlog("buildCache: extracting", count, "frames via seek (no rVFC)");
          await extractBySeek(off, targets, captureInto);
        }

        if (disposed) {
          bitmaps.forEach((b) => b?.close());
          cleanupOff();
          return;
        }
        const got = bitmaps.filter(Boolean).length;
        dlog("buildCache: captured", got, "/", count, "frames");
        if (!got) throw new Error("no frames captured");
        // Fill any missed slots with the nearest captured neighbour so the
        // progress-indexed draw never lands on a null.
        fillGaps(bitmaps);

        frames.current = bitmaps as ImageBitmap[];
        cacheReady.current = true;
        setCanvasReady(true);
        setVideoVisible(false);
        setPosterVisible(false);
        dlog("buildCache: DONE — cacheReady, unique frames =", got, "of", count);
      } catch (e) {
        const err = e as Error;
        // Surface the REAL reason, loudly, so it shows even outside dev tracing.
        console.error("[ScrollVideo] frame-cache extraction failed:", err?.name, err?.message, err);
        bitmaps.forEach((b) => b?.close());
      } finally {
        cleanupOff();
      }
    }

    // Play the offscreen video through ONCE and grab frames as they are
    // actually presented (requestVideoFrameCallback). This avoids per-frame
    // random seeks entirely - the failure mode observed on the real 1080p
    // stream, where most seeks never fired 'seeked'.
    function extractByPlayback(
      off: RVFCVideo,
      targets: number[],
      captureInto: (i: number) => Promise<void>,
    ): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        let ti = 0;
        let done = false;
        let working = false; // guards against ended + rVFC overlapping
        off.playbackRate = PLAYBACK_RATE;
        const watchdog = setTimeout(() => finish(), EXTRACTION_WATCHDOG_MS);
        function finish(err?: unknown) {
          if (done) return;
          done = true;
          clearTimeout(watchdog);
          off.removeEventListener("ended", onEndedEvent);
          try {
            off.pause();
          } catch {
            /* ignore */
          }
          if (err) reject(err instanceof Error ? err : new Error(String(err)));
          else resolve();
        }
        // Fill every target still pending from the frame currently shown.
        async function fillUpTo(limitTime: number) {
          while (ti < targets.length && limitTime + 1e-3 >= targets[ti]) {
            await captureInto(ti);
            if (ti % 15 === 0) dlog("buildCache: play-through captured", ti + 1, "/", targets.length);
            ti++;
          }
        }
        const onFrame = (_now: number, meta: FrameMeta) => {
          if (disposed) return finish();
          if (done) return;
          working = true;
          void (async () => {
            try {
              await fillUpTo(meta.mediaTime);
            } catch (e) {
              working = false;
              return finish(e);
            }
            working = false;
            if (ti >= targets.length) return finish();
            if (off.ended) return void onEnded();
            off.requestVideoFrameCallback?.(onFrame);
          })();
        };
        // 'ended' is the reliable end signal: rVFC stops firing once the video
        // ends (no more presented frames), so the play-through loop alone would
        // hang. On end, fill any remaining targets from the final frame.
        async function onEnded() {
          if (done) return;
          // let an in-flight onFrame finish first
          for (let i = 0; i < 20 && working; i++) await new Promise((r) => setTimeout(r, 10));
          if (done) return;
          try {
            while (ti < targets.length) {
              await captureInto(ti);
              ti++;
            }
            dlog("buildCache: play-through reached end; filled to", ti, "/", targets.length);
            finish();
          } catch (e) {
            finish(e);
          }
        }
        const onEndedEvent = () => void onEnded();
        off.addEventListener("ended", onEndedEvent);
        off.requestVideoFrameCallback?.(onFrame);
        off.play().catch((e) => finish(e));
      });
    }

    // Fallback when requestVideoFrameCallback is unavailable: seek frame by
    // frame. Now DOM-attached and waits a presented frame after 'seeked'.
    async function extractBySeek(
      off: RVFCVideo,
      targets: number[],
      captureInto: (i: number) => Promise<void>,
    ) {
      for (let i = 0; i < targets.length; i++) {
        if (disposed) return;
        const ok = await seekToPainted(off, targets[i]);
        if (!ok) {
          dlog("buildCache: seek TIMED OUT at frame", i, "t =", targets[i].toFixed(2));
          continue;
        }
        try {
          await captureInto(i);
        } catch (e) {
          const err = e as Error;
          console.error("[ScrollVideo] capture failed at frame", i, err?.name, err?.message);
        }
        if (i % 15 === 0) dlog("buildCache: seek captured", i + 1, "/", targets.length);
      }
    }

    function seekToPainted(off: RVFCVideo, time: number): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        let settled = false;
        const finish = (ok: boolean) => {
          if (settled) return;
          settled = true;
          off.removeEventListener("seeked", onSeeked);
          clearTimeout(to);
          resolve(ok);
        };
        const onSeeked = () => {
          // 'seeked' fired, but the frame may not be painted yet; wait one
          // presented frame when we can.
          if (off.requestVideoFrameCallback) off.requestVideoFrameCallback(() => finish(true));
          else finish(true);
        };
        const to = setTimeout(() => finish(false), SEEK_TIMEOUT_MS);
        off.addEventListener("seeked", onSeeked);
        try {
          off.currentTime = time;
        } catch {
          finish(false);
        }
      });
    }

    function fillGaps(arr: (ImageBitmap | null)[]) {
      // forward fill
      let last: ImageBitmap | null = null;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]) last = arr[i];
        else if (last) arr[i] = last;
      }
      // backfill any leading nulls
      let next: ImageBitmap | null = null;
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i]) next = arr[i];
        else if (next) arr[i] = next;
      }
    }

    // --- render loop ------------------------------------------------------
    let raf = 0;
    let lastModeLog = 0;
    function frame() {
      raf = requestAnimationFrame(frame);
      smoothed.current += (targetProgress.current - smoothed.current) * LERP;
      const p = smoothed.current;

      if (cacheReady.current && frames.current.length && ctx && canvas) {
        const idx = Math.min(frames.current.length - 1, Math.max(0, Math.round(p * (frames.current.length - 1))));
        const bmp = frames.current[idx];
        if (bmp) {
          const r = coverRect(bmp.width, bmp.height, canvas.width, canvas.height);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(bmp, r.x, r.y, r.w, r.h);
        }
      } else if (hasFrame.current && video) {
        // Fallback: seek the visible <video> itself. Uses the RESOLVED
        // duration (video.duration may be non-finite on real MP4s).
        const dur = videoDuration.current;
        if (isFinite(dur) && dur > 0) {
          const t = p * (dur - 0.05);
          if (Math.abs(t - lastSeek.current) > SEEK_EPSILON) {
            lastSeek.current = t;
            try {
              video.currentTime = t;
            } catch {
              /* ignore transient seek errors */
            }
            if (DEBUG) {
              const now = performance.now();
              if (now - lastModeLog > 500) {
                lastModeLog = now;
                dlog("render: seek-fallback t =", t.toFixed(2), "/", dur.toFixed(2));
              }
            }
          }
        }
      }
    }
    frame();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeCanvas);
      window.removeEventListener("scroll", readScroll);
      video.removeEventListener("loadeddata", onLoadedData);
      // Close each unique bitmap once (fillGaps may repeat references).
      new Set(frames.current).forEach((b) => b?.close());
      frames.current = [];
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src, dpr]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#f4eadd]"
    >
      {poster && (
        <img
          src={poster}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            posterVisible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          videoVisible && !canvasReady ? "opacity-100" : "opacity-0"
        }`}
      />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          canvasReady ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
