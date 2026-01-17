// src/lib/actions/reveal.ts
type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
  delay?: number; // ms
  once?: boolean;
};

export function reveal(node: HTMLElement, opts: RevealOptions = {}) {
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -10% 0px",
    delay = 0,
    once = true
  } = opts;

  // If we're in SSR or old browser, just reveal
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
    node.classList.add("is-revealed");
    return { destroy() {} };
  }

  // Respect reduced motion
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
    node.classList.add("is-revealed");
    return { destroy() {} };
  }

  let revealed = false;

  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;

      if (entry.isIntersecting && (!revealed || !once)) {
        revealed = true;
        window.setTimeout(() => node.classList.add("is-revealed"), delay);
        if (once) io.unobserve(node);
      }
    },
    { threshold, rootMargin }
  );

  io.observe(node);

  return {
    destroy() {
      io.disconnect();
    }
  };
}
