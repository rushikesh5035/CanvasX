import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useCreateProject = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (prompt: string) =>
      await axios.post("/api/project", { prompt }).then((res) => res.data),
    onSuccess: (data) => {
      router.push(`/project/${data.data.id}`);
    },
    onError: () => {
      toast.error("Failed to create project.");
    },
  });
};

export const useGetProjects = (userId?: string) => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get("/api/project");
      return res.data.data;
    },
    enabled: !!userId,
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string) =>
      await axios.delete(`/api/project/${projectId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });
};
