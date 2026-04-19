import { useEffect, useRef, useState, useCallback } from "react";

export function useInfiniteScroll<T>(
  fetchMore: (cursor: number) => Promise<T[]> | T[],
  options?: { initialCursor?: number; max?: number; rootMargin?: string },
) {
  const { initialCursor = 0, max = 500, rootMargin = "200px" } = options ?? {};
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const cursorRef = useRef(initialCursor);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || done) return;
    setLoading(true);
    // Small delay to make the loader visible (mock telemetry feel)
    await new Promise((r) => setTimeout(r, 650));
    const next = await fetchMore(cursorRef.current);
    cursorRef.current += next.length;
    setItems((prev) => {
      const merged = [...prev, ...next];
      if (merged.length >= max) setDone(true);
      return merged.slice(0, max);
    });
    setLoading(false);
  }, [fetchMore, loading, done, max]);

  // Initial load
  useEffect(() => {
    if (items.length === 0) void loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore, rootMargin]);

  return { items, loading, done, sentinelRef };
}
