import { useEffect, useState } from "react";
import { watchForElements } from "@/lib/watch-for-elements";

export function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0.1, 0.25, 0.5, 0.75] },
    );

    // Sections below the fold may be React.lazy-loaded and not yet mounted
    // when this effect first runs - watch for each id to appear and start
    // observing it as soon as it does, rather than only checking once.
    const observed = new Set<string>();
    const stopWatching = watchForElements(sectionIds, (elements) => {
      for (const [id, el] of elements) {
        if (!observed.has(id)) {
          observer.observe(el);
          observed.add(id);
        }
      }
    });

    return () => {
      stopWatching();
      observer.disconnect();
    };
  }, [sectionIds]);

  return active;
}
