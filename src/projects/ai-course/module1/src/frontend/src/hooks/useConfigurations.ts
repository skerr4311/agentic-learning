import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../api/client";
import type {
  CreateConfigurationRequest,
  UpdateConfigurationRequest,
} from "../types";

export const useConfigurations = (applicationId: string) => {
  return useQuery({
    queryKey: ["configurations", applicationId],
    queryFn: () => apiClient.getConfigurations(applicationId),
    enabled: Boolean(applicationId),
  });
};

export const useConfiguration = (
  applicationId: string,
  configurationId: string,
) => {
  return useQuery({
    queryKey: ["configurations", applicationId, configurationId],
    queryFn: () => apiClient.getConfiguration(applicationId, configurationId),
    enabled: Boolean(applicationId) && Boolean(configurationId),
  });
};

export const useCreateConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: CreateConfigurationRequest;
    }) => apiClient.createConfiguration(applicationId, data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["configurations", applicationId],
      });
    },
  });
};

export const useUpdateConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      configurationId,
      data,
    }: {
      applicationId: string;
      configurationId: string;
      data: UpdateConfigurationRequest;
    }) => apiClient.updateConfiguration(applicationId, configurationId, data),
    onSuccess: (_, { applicationId, configurationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["configurations", applicationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["configurations", applicationId, configurationId],
      });
    },
  });
};

export const useDeleteConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      configurationId,
    }: {
      applicationId: string;
      configurationId: string;
    }) => apiClient.deleteConfiguration(applicationId, configurationId),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["configurations", applicationId],
      });
    },
  });
};
