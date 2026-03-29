"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import Header from "@/components/common/header";
import ProjectCardSkeleton from "@/components/common/project-card-skeleton";
import ProjectCard from "@/components/common/projectCard";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetProjects } from "@/features/use-project";
import { useCurrentUser } from "@/lib/session";
import { ProjectType } from "@/types/project";

export default function ProjectsPage() {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const userId = user?.id;

  const { data: projects, isLoading, isError } = useGetProjects(userId);

  if (!user && !isUserLoading) {
    router.push("/signin");
    return null;
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen w-full">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Spinner className="size-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="shrink-0"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Projects</h1>
            <p className="text-muted-foreground mt-1">
              {projects?.length
                ? `${projects.length} project${projects.length !== 1 ? "s" : ""}`
                : "No projects yet"}
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-destructive text-lg">Failed to load projects</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {projects.map((project: ProjectType) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-muted-foreground text-lg">No projects found</p>
            <Button
              variant="default"
              className="mt-4"
              onClick={() => router.push("/")}
            >
              Create Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
