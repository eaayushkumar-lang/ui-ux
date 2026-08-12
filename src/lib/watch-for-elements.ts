/**
 * Watches the DOM for a fixed set of element ids to appear, since
 * React.lazy/Suspense-loaded sections don't exist in the document at the
 * moment an effect first runs `document.getElementById`. Calls `onChange`
 * with every id->element found so far, once immediately (for ids already
 * present) and again each time a MutationObserver detects new matches,
 * until every id has been found - at which point it stops observing.
 */
export function watchForElements(
  ids: string[],
  onChange: (elements: Map<string, HTMLElement>) => void,
): () => void {
  const found = new Map<string, HTMLElement>();

  function scan() {
    let changed = false;
    for (const id of ids) {
      if (!found.has(id)) {
        const el = document.getElementById(id);
        if (el) {
          found.set(id, el);
          changed = true;
        }
      }
    }
    return changed;
  }

  if (scan()) onChange(found);
  if (found.size >= ids.length) return () => {};

  const observer = new MutationObserver(() => {
    if (scan()) {
      onChange(found);
      if (found.size >= ids.length) observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}
