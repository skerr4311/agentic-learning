import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../api/client";
import type {
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from "../types";

export const useApplications = () => {
  return useQuery({
    queryKey: ["applications"],
    queryFn: () => apiClient.getApplications(),
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: ["applications", id],
    queryFn: () => apiClient.getApplication(id),
    enabled: Boolean(id),
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationRequest) =>
      apiClient.createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateApplicationRequest;
    }) => apiClient.updateApplication(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications", id] });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
