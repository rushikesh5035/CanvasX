"use client";

import React, { memo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { formatDistanceToNow } from "date-fns";
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
import { ProjectType } from "@/types/project";

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
        className="flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border hover:shadow-md"
        onClick={onRoute}
      >
        <div className="bg[#eee] relative flex h-40 items-center justify-center overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={`${project.name} project thumbnail`}
              className="h-full w-full object-cover"
              width={320}
              height={180}
            />
          ) : (
            <div className="bg-primary/20 text-primary flex h-16 w-16 items-center justify-center rounded-full">
              <FolderOpenDotIcon />
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-2 p-4">
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 line-clamp-1 w-full truncate text-sm font-semibold">
              {project.name}
            </h3>
            <p className="text-muted-foreground text-xs">{timeAgo}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 shrink-0 px-2 text-red-500 hover:cursor-pointer hover:bg-red-500/10 hover:text-red-600"
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
