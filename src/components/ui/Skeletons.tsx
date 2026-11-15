// Route loading states. On a slow connection, tapping a card used to leave the old page on
// screen with no feedback; these appear immediately and match the real layout's shape so
// nothing jumps when content arrives. They are placeholders, never shown as product shots.

function Bar({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-zinc-800/80 ${className}`} />;
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="aspect-[4/5] sm:aspect-[9/16] rounded-xl border border-zinc-800/90 bg-zinc-950 p-4 flex flex-col justify-between animate-pulse"
        >
          <Bar className="h-6 w-24" />
          <div className="flex flex-col gap-2.5">
            <Bar className="h-3 w-28" />
            <Bar className="h-6 w-3/4" />
            <Bar className="h-7 w-full" />
            <Bar className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingLabel({ text }: { text: string }) {
  return (
    <p role="status" className="sr-only">
      {text}
    </p>
  );
}

export { Bar as SkeletonBar };
