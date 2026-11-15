import { CardGridSkeleton, LoadingLabel, SkeletonBar } from "@/components/ui/Skeletons";

export default function DiscoverLoading() {
  return (
    <main className="relative min-h-screen pt-28 pb-24 px-6 lg:px-24">
      <LoadingLabel text="Memuat daftar server" />
      <div className="max-w-7xl mx-auto flex flex-col gap-8 animate-pulse">
        <div className="flex flex-col gap-3">
          <SkeletonBar className="h-9 w-56" />
          <SkeletonBar className="h-4 w-40" />
        </div>
        <SkeletonBar className="h-11 w-full" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBar key={i} className="h-8 w-24 shrink-0 rounded-full" />
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8">
        <CardGridSkeleton />
      </div>
    </main>
  );
}
