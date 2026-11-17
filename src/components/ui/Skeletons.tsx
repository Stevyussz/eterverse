// Route loading states. They appear immediately and match the real layout's shape so nothing
// jumps when content arrives. Placeholders only, never shown as product shots.
// Stepped pulse (px-blink would flash; a slow steps(2) fade reads as "loading chunks").

function Bar({ className = "" }: { className?: string }) {
  return <div className={`bg-slot ${className}`} />;
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="px-flat flex flex-col animate-pulse">
          <div className="aspect-video bg-ink/80 border-b-[3px] border-ink" />
          <div className="p-4 flex flex-col gap-3">
            <div className="flex gap-3">
              <Bar className="w-11 h-11 shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Bar className="h-5 w-3/4" />
                <Bar className="h-3 w-1/2" />
              </div>
            </div>
            <Bar className="h-7 w-full" />
            <Bar className="h-4 w-2/3" />
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
