import { Skeleton } from "@/components/ui/skeleton";

const ProjectCardSkeleton = () => {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border">
      {/* Thumbnail skeleton */}
      <Skeleton className="h-40 w-full rounded-none" />

      {/* Content skeleton */}
      <div className="flex items-start justify-between gap-2 p-4">
        <div className="min-w-0 flex-1 space-y-2">
          {/* Project name skeleton */}
          <Skeleton className="h-4 w-3/4" />
          {/* Time ago skeleton */}
          <Skeleton className="h-3 w-1/2" />
        </div>
        {/* Delete button skeleton */}
        <Skeleton className="h-8 w-8 shrink-0" />
      </div>
    </div>
  );
};

ProjectCardSkeleton.displayName = "ProjectCardSkeleton";

export default ProjectCardSkeleton;
