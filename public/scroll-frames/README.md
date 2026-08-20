# Hero scroll-scrub frames

This directory holds the pre-rendered hero frames (`frame-0001.webp` …
`frame-0072.webp`) that `src/components/scroll-frames.tsx` scrubs on scroll,
replacing the runtime video decode. They are the **same footage** as the current
hero — extracted from the exact same CloudFront video, nothing swapped.

They are not committed from the Claude sandbox because its egress policy blocks
the CloudFront host. Generate + activate them on a machine with normal network
access, in three steps:

## 1. Extract the frames (needs ffmpeg with libwebp)

Install FFmpeg first if you don't have it — on Windows: `winget install Gyan.FFmpeg`
(then reopen the terminal so `ffmpeg`/`ffprobe` are on PATH).

- **Windows PowerShell:**

      powershell -ExecutionPolicy Bypass -File scripts\extract-scroll-frames.ps1

- **macOS / Linux / Git Bash (bundled with Git for Windows):**

      bash scripts/extract-scroll-frames.sh

Either one writes `public/scroll-frames/frame-0001.webp … frame-0072.webp` (1280px).

## 2. Activate the image-sequence hero — one import swap in `src/pages/home.tsx`

Change the hero import + render from the video component to the frame component:

```diff
- import { ScrollVideo } from "@/components/scroll-video";
- import { HERO_VIDEO_URL } from "@/lib/hero-video";
+ import { ScrollFrames } from "@/components/scroll-frames";
```

```diff
-      <ScrollVideo src={HERO_VIDEO_URL} />
+      <ScrollFrames />
```

(Everything else — `BrandIntro`, the transparent sections, the scroll feel —
stays exactly the same. `ScrollFrames` preserves the same 0.12 lerp smoothing,
DPR cap, object-cover crop, poster-first paint, and 500ms crossfade.)

## 3. Commit the frames + the swap together, then deploy

Commit `public/scroll-frames/*.webp` alongside the `home.tsx` change so the
frames always ship with the activation (never activate the component before the
frames exist, or the hero will show only the base colour until they load).

Once live you can delete the old `src/components/scroll-video.tsx` and
`src/lib/hero-video.ts` if nothing else references them.
