import { CardGridSkeleton, LoadingLabel, SkeletonBar } from "@/components/ui/Skeletons";

export default function DiscoverLoading() {
  return (
    <main className="relative min-h-screen pb-8">
      <LoadingLabel text="Memuat daftar server" />
      <div className="sand-band pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 flex flex-col gap-3 animate-pulse">
          <SkeletonBar className="h-4 w-24" />
          <SkeletonBar className="h-10 w-64" />
          <SkeletonBar className="h-4 w-40" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col gap-7">
        <SkeletonBar className="h-[72px] w-full animate-pulse" />
        <div className="flex gap-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBar key={i} className="h-10 w-24 shrink-0" />
          ))}
        </div>
        <CardGridSkeleton />
      </div>
    </main>
  );
}
