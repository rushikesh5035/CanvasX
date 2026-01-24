"use client";

import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import React, { memo, useState } from "react";
import { ProjectType } from "@/types/project";
import { FolderOpenDotIcon, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProject } from "@/features/use-project";

const ProjectCard = ({ project }: { project: ProjectType }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const updatedAtDate = new Date(project.updatedAt || new Date());
  const timeAgo = formatDistanceToNow(updatedAtDate, { addSuffix: true });

  const thumbnail = project.thumbnail || null;

  const onRoute = () => {
    router.push(`/project/${project.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    deleteProject(project.id, {
      onSettled: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  return (
    <>
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

        <div className="p-4 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate w-full mb-1 line-clamp-1">
              {project.name}
            </h3>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:cursor-pointer flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{project.name}&quot;? <br />
              This action cannot be undone and will permanently delete the
              project and all its screens.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
