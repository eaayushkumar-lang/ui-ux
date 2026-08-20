#!/usr/bin/env bash
#
# Pre-extract the hero scroll-scrub frames from the EXACT SAME CloudFront hero
# video into public/scroll-frames/frame-0001.webp .. frame-0150.webp (1280px
# wide WebP). No footage is swapped — this is the same source file the current
# ScrollVideo already streams. Frame count raised from 72 to 150 for finer
# scroll granularity (less visual distance between consecutive frames).
#
# The ScrollFrames component (src/components/scroll-frames.tsx) draws these to a
# canvas on scroll, replacing the runtime video decode. Re-run whenever the
# source video changes, then swap home.tsx's hero import to ScrollFrames.
#
# NOTE: run this from a machine WITH network access to CloudFront. The Claude
# Code sandbox blocks that host by egress policy, so the frames cannot be
# generated there.
#
# Requires ffmpeg + ffprobe (with libwebp) on PATH. Usage:
#   bash scripts/extract-scroll-frames.sh
set -euo pipefail

# Same URL as src/lib/hero-video.ts — do not change the footage.
SRC="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4"
OUT="public/scroll-frames"
COUNT=150     # keep in sync with ScrollFrames' `count` default
WIDTH=1280
QUALITY=72    # libwebp quality (0-100)

command -v ffmpeg >/dev/null || { echo "ffmpeg not found on PATH" >&2; exit 1; }
command -v ffprobe >/dev/null || { echo "ffprobe not found on PATH" >&2; exit 1; }

rm -rf "$OUT"
mkdir -p "$OUT"

# Sample COUNT evenly-spaced frames across the whole clip.
DUR="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")"
FPS="$(awk "BEGIN { printf \"%.6f\", $COUNT / $DUR }")"

ffmpeg -y -i "$SRC" \
  -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos" \
  -frames:v "$COUNT" \
  -c:v libwebp -q:v "$QUALITY" \
  "$OUT/frame-%04d.webp"

# Optional JPEG fallback set (set ScrollFrames' ext to "jpg" to use it):
#   ffmpeg -y -i "$SRC" -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos" \
#     -frames:v "$COUNT" -q:v 4 "$OUT/frame-%04d.jpg"

echo "Wrote $(ls "$OUT"/frame-*.webp | wc -l) frames to $OUT (source ${DUR}s, ${WIDTH}px)."
du -sh "$OUT"
