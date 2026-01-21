"use client";

import Canvas from "@/components/canvas";
import ProjectHeader from "@/components/project/project-header";
import { CanvasProvider } from "@/context/canvas-context";
import { useGetProjectById } from "@/features/use-project-id";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params.id as string;

  const { data: project, isPending } = useGetProjectById(id);

  // const frames = project?.frames || [];
  // const themeId = project?.theme || "";

  const hasInitialData = project?.frames.length > 0;

  if (!isPending && !project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="relative h-screen w-full flex flex-col">
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
