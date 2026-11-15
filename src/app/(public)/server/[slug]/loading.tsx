import { LoadingLabel, SkeletonBar } from "@/components/ui/Skeletons";

export default function ServerLoading() {
  return (
    <>
      <LoadingLabel text="Memuat halaman server" />
      <div className="h-[280px] sm:h-[380px] md:h-[460px] w-full bg-zinc-950/60 animate-pulse" />
      <main className="relative px-4 sm:px-6 lg:px-24 pb-32 -mt-20 sm:-mt-28">
        <div className="max-w-5xl mx-auto flex flex-col gap-6 animate-pulse">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl bg-zinc-800 border border-zinc-700 shrink-0" />
            <div className="flex flex-col gap-2.5 flex-1">
              <SkeletonBar className="h-8 w-2/3" />
              <SkeletonBar className="h-4 w-1/2" />
            </div>
          </div>
          <div className="flex gap-2.5">
            <SkeletonBar className="h-14 w-20" />
            <SkeletonBar className="h-11 w-36" />
            <SkeletonBar className="h-11 w-28" />
          </div>
          <SkeletonBar className="h-40 w-full rounded-xl" />
          <SkeletonBar className="h-64 w-full rounded-xl" />
        </div>
      </main>
    </>
  );
}
