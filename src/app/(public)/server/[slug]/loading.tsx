import { LoadingLabel, SkeletonBar } from "@/components/ui/Skeletons";

export default function ServerLoading() {
  return (
    <main className="relative pt-16 pb-32">
      <LoadingLabel text="Memuat halaman server" />
      <div className="h-[240px] sm:h-[340px] md:h-[420px] w-full bg-screen border-b-[3px] border-frame animate-pulse" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-14 flex flex-col gap-6 animate-pulse">
        <div className="px-flat p-5 flex items-end gap-4">
          <SkeletonBar className="w-20 h-20 sm:w-24 sm:h-24 shrink-0" />
          <div className="flex flex-col gap-2.5 flex-1">
            <SkeletonBar className="h-8 w-2/3" />
            <SkeletonBar className="h-4 w-1/2" />
          </div>
        </div>
        <div className="flex gap-3">
          <SkeletonBar className="h-12 w-28" />
          <SkeletonBar className="h-12 w-36" />
          <SkeletonBar className="h-12 w-28" />
        </div>
        <SkeletonBar className="h-40 w-full" />
        <SkeletonBar className="h-64 w-full" />
      </div>
    </main>
  );
}
