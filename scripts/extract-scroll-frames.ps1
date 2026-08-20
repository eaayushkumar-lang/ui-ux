# Pre-extract the hero scroll-scrub frames from the EXACT SAME CloudFront hero
# video into public/scroll-frames/frame-0001.webp .. frame-0072.webp (1280px WebP).
# Windows / PowerShell equivalent of scripts/extract-scroll-frames.sh — no footage
# is swapped, it is the same source file the current hero already streams.
#
# Requires FFmpeg (ffmpeg + ffprobe) on PATH. Install once with:
#     winget install Gyan.FFmpeg
# then reopen the terminal. Run from the repo root:
#     powershell -ExecutionPolicy Bypass -File scripts\extract-scroll-frames.ps1

$ErrorActionPreference = "Stop"

# Same URL as src/lib/hero-video.ts — do not change the footage.
$Src     = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4"
$Out     = "public/scroll-frames"
$Count   = 72     # keep in sync with ScrollFrames' `count` default
$Width   = 1280
$Quality = 72     # libwebp quality (0-100)

foreach ($tool in @("ffmpeg", "ffprobe")) {
  if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
    throw "$tool not found on PATH. Install FFmpeg (winget install Gyan.FFmpeg) and reopen the terminal."
  }
}

if (Test-Path $Out) { Remove-Item -Recurse -Force $Out }
New-Item -ItemType Directory -Force -Path $Out | Out-Null

# Sample $Count evenly-spaced frames across the whole clip. Parse/format numbers
# with the invariant culture so a comma-decimal locale can't corrupt the fps arg.
$inv    = [System.Globalization.CultureInfo]::InvariantCulture
$durStr = (& ffprobe -tls_verify 0 -v error -show_entries format=duration -of csv=p=0 $Src).Trim()
$dur    = [double]::Parse($durStr, $inv)
$fps    = ([double]$Count / $dur).ToString($inv)

& ffmpeg -y -tls_verify 0 -i $Src `
  -vf "fps=$fps,scale=${Width}:-2:flags=lanczos" `
  -frames:v $Count `
  -c:v libwebp -q:v $Quality `
  "$Out/frame-%04d.webp"

$n = (Get-ChildItem "$Out/frame-*.webp").Count
Write-Host "Wrote $n frames to $Out (source $durStr s, ${Width}px)."
