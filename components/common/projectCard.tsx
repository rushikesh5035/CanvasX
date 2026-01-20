import project from "@/app/(routes)/project/[id]/page";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import React, { memo } from "react";
import { ProjectType } from "@/types/project";
import Image from "next/image";
import { FolderOpenDotIcon } from "lucide-react";

const ProjectCard = ({ project }: { project: ProjectType }) => {
  const router = useRouter();

  const createdAtDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });

  const thumbnail = project.thumbnail || null;

  const onRoute = () => {
    router.push(`/project/${project.id}`);
  };

  return (
    <div
      role="button"
      className="w-full flex flex-col border rounded-xl cursor-pointer
    hover:shadow-md overflow-hidden"
      onClick={onRoute}
    >
      <div className="h-40 bg[#eee] relative overflow-hidden flex items-center justify-center">
        {thumbnail ? (
          <img
            src={thumbnail}
            className="w-full h-full object-cover object-left
           scale-110"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <FolderOpenDotIcon />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col">
        <h3 className="font-semibold text-sm truncate w-full mb-1 line-clamp-1">
          {project.name}
        </h3>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </div>
  );
};

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
