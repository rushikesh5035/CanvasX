"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useGetProjects } from "@/features/use-project";
import { useCurrentUser } from "@/lib/session";
import { ProjectType } from "@/types/project";

import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import ProjectCardSkeleton from "./project-card-skeleton";
import ProjectCard from "./projectCard";

const RecentProjects = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const { user } = useCurrentUser();
  const userId = user?.id;

  const { data: projects, isLoading, isError } = useGetProjects(userId);

  const handleSeeMore = () => {
    setIsNavigating(true);
    router.push("/projects");
  };

  if (!userId) return null;
  if (!isLoading && (!projects || projects.length === 0)) return null;

  return (
    <div className="w-full py-10">
      <div className="mx-auto max-w-3xl">
        <div>
          <h1 className="text-xl font-medium tracking-tight">
            Recent Projects
          </h1>
          {isLoading ? (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </div>
          ) : (
            <>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {projects?.slice(0, 3).map((project: ProjectType) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              {projects && projects.length > 3 && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="default"
                    size="lg"
                    className="hover:cursor-pointer"
                    onClick={handleSeeMore}
                    disabled={isNavigating}
                  >
                    {isNavigating ? (
                      <>
                        <Spinner className="mr-2 size-4" />
                        Loading...
                      </>
                    ) : (
                      "See More Projects"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        {isError && <p className="text-red-500">Failed to load projects</p>}
      </div>
    </div>
  );
};

export default RecentProjects;
