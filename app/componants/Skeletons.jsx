// Grey placeholder blocks shown while a page or a section loads, in the same
// shape as the real content, so nothing jumps when the data arrives.
// Server-safe (no hooks), so loading.jsx files and Suspense fallbacks can use them.

const pulse = "animate-pulse rounded-xl bg-gray-200/70";

export function Bar({ className = "", style }) {
  return <div className={`${pulse} ${className}`} style={style} aria-hidden="true" />;
}

/** Live journey: status card, route card, two stop rows. */
export function JourneySkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      <div className="flex items-center gap-3">
        <Bar className="h-10 w-10 !rounded-full" />
        <div className="flex-1 space-y-2">
          <Bar className="h-4 w-2/3" />
          <Bar className="h-3 w-1/2" />
        </div>
      </div>
      <Bar className="h-11" />
      <Bar className="h-[118px]" />
      <Bar className="h-[260px]" />
      <Bar className="h-16" />
      <Bar className="h-16" />
    </div>
  );
}

/** One kitchen card (photo + three lines). */
export function KitchenCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[20px] bg-white ring-1 ring-black/5" aria-hidden="true">
      <div className="aspect-[2/1] w-full animate-pulse bg-gray-200/70" />
      <div className="space-y-2 p-4">
        <Bar className="h-4 w-1/2" />
        <Bar className="h-3 w-3/4" />
        <Bar className="h-3 w-2/5" />
      </div>
    </div>
  );
}

/** Banner + heading + kitchen cards (station pages). */
export function StationSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 p-4" aria-busy="true" aria-label="Loading">
      <Bar className="h-32 !rounded-none" />
      <Bar className="mx-auto h-7 w-3/4" />
      <Bar className="h-5 w-1/2" />
      <KitchenCardSkeleton />
      <KitchenCardSkeleton />
    </div>
  );
}

/** Menu page: kitchen header card + item rows. */
export function MenuSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading menu">
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
        <div className="h-48 w-full animate-pulse bg-gray-200/70" />
        <div className="space-y-2 p-4">
          <Bar className="h-6 w-1/2" />
          <Bar className="h-3 w-1/3" />
          <Bar className="h-3 w-4/5" />
        </div>
      </div>
      <Bar className="mx-auto h-5 w-32" />
      {[0, 1, 2, 3].map((i) => (
        <MenuItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="flex gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5" aria-hidden="true">
      <div className="flex-1 space-y-2">
        <Bar className="h-3 w-20" />
        <Bar className="h-4 w-3/4" />
        <Bar className="h-3 w-12" />
        <Bar className="h-3 w-full" />
        <Bar className="mt-3 h-4 w-14" />
      </div>
      <Bar className="h-28 w-28 shrink-0" />
    </div>
  );
}

/** Article / blog post: hero, title, paragraphs. */
export function ArticleSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 p-4" aria-busy="true" aria-label="Loading">
      <Bar className="aspect-[16/9] w-full" />
      <Bar className="h-7 w-4/5" />
      <Bar className="h-3 w-32" />
      {[100, 95, 98, 80, 92, 60].map((w, i) => (
        <Bar key={i} className="h-3.5" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

/** Grid of cards (blog list, offers). */
export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl bg-white ring-1 ring-black/5">
          <div className="h-40 w-full animate-pulse bg-gray-200/70" />
          <div className="space-y-2 p-4">
            <Bar className="h-4 w-3/4" />
            <Bar className="h-3 w-full" />
            <Bar className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Generic page: heading + a few blocks. */
export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 p-4" aria-busy="true" aria-label="Loading">
      <Bar className="h-40" />
      <Bar className="h-7 w-2/3" />
      <Bar className="h-24" />
      <Bar className="h-24" />
      <Bar className="h-24" />
    </div>
  );
}
