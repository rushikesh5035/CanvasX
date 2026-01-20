"use client";

import ProjectHeader from "@/components/project/project-header";
import { useGetProjectById } from "@/features/use-project-id";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();

  const id = params.id as string;

  const { data: project, isPending } = useGetProjectById(id);

  const frames = project?.frames || [];
  const theme = project?.theme || "";

  if (!isPending && !project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="relative h-screen w-full flex flex-col">
      <ProjectHeader projectName={project?.name} />
    </div>
  );
};

export default Page;
