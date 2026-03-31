"use client";

import { useParams } from "next/navigation";

import Canvas from "@/components/canvas";
import ProjectHeader from "@/components/project/project-header";
import { CanvasProvider } from "@/context/canvas-context";
import { useGetProjectById } from "@/features/use-project-id";

const Page = () => {
  const params = useParams();
  const id = params.id as string;

  const { data: project, isPending } = useGetProjectById(id);

  const hasInitialData = (project?.frames?.length ?? 0) > 0;

  if (!isPending && !project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="relative flex h-screen w-full flex-col">
      <ProjectHeader projectName={project?.name} />

      <CanvasProvider
        initialFrames={project?.frames}
        initialThemeId={project?.theme}
        hasInitialData={hasInitialData}
        projectId={project?.id}
      >
        <div className="flex flex-1 overflow-hidden">
          <div className="relative flex-1">
            <Canvas
              projectId={project?.id}
              projectName={project?.name}
              isPending={isPending}
            />
          </div>
        </div>
      </CanvasProvider>
    </div>
  );
};

export default Page;
