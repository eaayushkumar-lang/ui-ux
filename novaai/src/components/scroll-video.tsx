import { useEffect, useRef, useState } from "react";

interface ScrollVideoProps {
  src: string;
  /** Optional poster still. Omit to let the #0a0a0a base show through
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

/** object-cover: scale the source up to cover the dest, centre-crop. */
function coverRect(sw: number, sh: number, dw: number, dh: number) {
  const scale = Math.max(dw / sw, dh / sh);
  const w = sw * scale;
  const h = sh * scale;
  return { x: (dw - w) / 2, y: (dh - h) / 2, w, h };
}

/**
 * Fixed, full-bleed scroll-scrubbed video background. Page scroll maps to
 * the video timeline (smoothed with a lerp), rendered onto a canvas from a
 * pre-extracted ImageBitmap frame cache for jitter-free scrubbing. Until
 * the cache is ready it crossfades poster -> live video (seeked directly),
 * then poster/video -> canvas. Never autoplays as a loop; motion is
 * scroll-driven only. If frame extraction can't run (e.g. the video isn't
 * CORS-readable), it stays in the live-video seek path - still fully
 * scroll-driven, just without the cache's extra smoothness.
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
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;

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

    // --- live video: first decoded frame lets us reveal it + kick off cache ---
    function onLoadedData() {
      if (disposed) return;
      hasFrame.current = true;
      if (!cacheReady.current) setVideoVisible(true);
      setPosterVisible(false);
      // Yield, then extract the frame cache from a separate offscreen video.
      window.setTimeout(() => {
        if (!disposed) void buildCache();
      }, EXTRACTION_DELAY_MS);
    }
    video.addEventListener("loadeddata", onLoadedData);

    // --- frame cache extraction (offscreen, CORS-enabled) -----------------
    async function buildCache() {
      const off = document.createElement("video");
      off.src = src;
      off.crossOrigin = "anonymous"; // required for createImageBitmap readback
      off.muted = true;
      off.playsInline = true;
      off.preload = "auto";

      try {
        await new Promise<void>((resolve, reject) => {
          off.addEventListener("loadedmetadata", () => resolve(), { once: true });
          off.addEventListener("error", () => reject(new Error("offscreen load error")), { once: true });
        });
        const duration = off.duration;
        if (!isFinite(duration) || duration <= 0) throw new Error("bad duration");

        const count = Math.max(MIN_FRAMES, Math.min(MAX_FRAMES, Math.round(duration * FRAMES_PER_SECOND)));
        const scratch = document.createElement("canvas");
        const sctx = scratch.getContext("2d");
        if (!sctx) throw new Error("no 2d context");

        const bitmaps: ImageBitmap[] = [];
        for (let i = 0; i < count; i++) {
          if (disposed) return;
          const t = (i / (count - 1)) * (duration - 0.05);
          await seekTo(off, t);
          const vw = off.videoWidth;
          const vh = off.videoHeight;
          if (!vw || !vh) continue;
          const scale = Math.min(1, MAX_FRAME_WIDTH / vw);
          scratch.width = Math.round(vw * scale);
          scratch.height = Math.round(vh * scale);
          sctx.drawImage(off, 0, 0, scratch.width, scratch.height);
          // createImageBitmap throws SecurityError if the source isn't
          // origin-clean - caught below to fall back to the seek path.
          bitmaps.push(await createImageBitmap(scratch));
        }

        if (disposed) {
          bitmaps.forEach((b) => b.close());
          return;
        }
        frames.current = bitmaps;
        cacheReady.current = true;
        setCanvasReady(true);
        setVideoVisible(false);
        setPosterVisible(false);
      } catch {
        // Extraction unavailable (CORS / decode) - keep the live-video seek
        // path; nothing to log loudly, the background still scrubs.
        off.removeAttribute("src");
        off.load();
      }
    }

    function seekTo(v: HTMLVideoElement, time: number) {
      return new Promise<void>((resolve) => {
        const onSeeked = () => {
          v.removeEventListener("seeked", onSeeked);
          resolve();
        };
        v.addEventListener("seeked", onSeeked);
        v.currentTime = time;
      });
    }

    // --- render loop ------------------------------------------------------
    let raf = 0;
    function frame() {
      raf = requestAnimationFrame(frame);
      smoothed.current += (targetProgress.current - smoothed.current) * LERP;
      const p = smoothed.current;

      if (cacheReady.current && frames.current.length && ctx && canvas) {
        const idx = Math.min(frames.current.length - 1, Math.max(0, Math.round(p * (frames.current.length - 1))));
        const bmp = frames.current[idx];
        const r = coverRect(bmp.width, bmp.height, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bmp, r.x, r.y, r.w, r.h);
      } else if (hasFrame.current && video) {
        const dur = video.duration;
        if (isFinite(dur) && dur > 0) {
          const t = p * (dur - 0.05);
          if (Math.abs(t - lastSeek.current) > SEEK_EPSILON) {
            lastSeek.current = t;
            try {
              video.currentTime = t;
            } catch {
              /* ignore transient seek errors */
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
      frames.current.forEach((b) => b.close());
      frames.current = [];
    };
  }, [src, dpr]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a]"
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
        src={src}
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
