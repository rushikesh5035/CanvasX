import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { getErrorMessage, rateLimitHandlers } from "@/lib/handle-rate-limit";

export const useGetProjectById = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await axios.get(`/api/project/${projectId}`);

      return res.data;
    },
    enabled: !!projectId,
  });
};

export const useGenerateProjectById = (projectId: string) => {
  return useMutation({
    mutationFn: async (prompt: string) =>
      await axios
        .post(`/api/project/${projectId}`, { prompt })
        .then((res) => res.data),
    onSuccess: () => {
      toast.success("Generation Started");
    },
    onError: (error: unknown) => {
      console.log("Error generating screen:", error);
      if (!rateLimitHandlers.screenGeneration(error)) {
        toast.error(getErrorMessage(error, "Failed to generate screen."));
      }
    },
  });
};

export const useUpdateProject = (projectId: string) => {
  return useMutation({
    mutationFn: async (themeId: string) =>
      await axios
        .patch(`/api/project/${projectId}`, { themeId })
        .then((res) => res.data),
    onSuccess: () => {
      toast.success("Project Updated");
    },
    onError: (error) => {
      console.log("Error updating project:", error);
      toast.error("Failed to update project");
    },
  });
};
