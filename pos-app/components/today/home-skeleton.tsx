import { Skeleton } from "@/components/ui/skeleton";

/**
 * Executive Experience Contract 001 — since the real Home now shows only
 * the immersive Garden stage by default (everything else is hidden until
 * the user asks for it), the loading state mirrors exactly that: the
 * stage shape and nothing else. There is nothing to skeleton for content
 * the user hasn't revealed yet.
 */
export function HomeSkeleton() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col">
      <div
        className="-mx-6 -mt-6 flex flex-col items-center gap-6 bg-[var(--color-surface)] px-6 pt-10 sm:pt-14"
        style={{ minHeight: "calc(100dvh - 11rem)" }}
      >
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-32 w-32 rounded-full sm:h-40 sm:w-40 lg:h-48 lg:w-48" />
        <div className="mt-auto flex flex-col items-center gap-2 pb-6">
          <Skeleton className="h-1 w-10 rounded-full" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}
