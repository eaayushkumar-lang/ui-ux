# Hero scroll-scrub frames

This directory holds the pre-rendered hero frames (`frame-0001.webp` …
`frame-0072.webp`) that `src/components/scroll-frames.tsx` scrubs on scroll.

Generate them from the exact same CloudFront hero video (same footage — nothing
is swapped) with:

    bash scripts/extract-scroll-frames.sh

Run it from an environment with network access to CloudFront (a dev machine or
CI). Then activate the image-sequence hero by changing the import in
`src/pages/home.tsx` from `ScrollVideo` (`@/components/scroll-video`) to
`ScrollFrames` (`@/components/scroll-frames`) and rendering `<ScrollFrames />`.
