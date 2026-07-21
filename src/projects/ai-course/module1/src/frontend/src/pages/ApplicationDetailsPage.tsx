import { useState } from "react";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { ApplicationForm } from "../components/ApplicationForm";
import { ConfigurationForm } from "../components/ConfigurationForm";
import { ConfigurationList } from "../components/ConfigurationList";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useApplication, useUpdateApplication } from "../hooks/useApplications";
import {
  useConfigurations,
  useCreateConfiguration,
  useDeleteConfiguration,
  useUpdateConfiguration,
} from "../hooks/useConfigurations";
import type {
  Configuration,
  CreateConfigurationRequest,
  UpdateApplicationRequest,
  UpdateConfigurationRequest,
} from "../types";

export default function ApplicationDetailsPage() {
  const { applicationId = "" } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();

  const [configFormOpen, setConfigFormOpen] = useState(false);
  const [appFormOpen, setAppFormOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<
    Configuration | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<Configuration | null>(
    null,
  );

  const {
    data: application,
    isLoading: appLoading,
    error: appError,
  } = useApplication(applicationId);
  const {
    data: configurationsData,
    isLoading: configsLoading,
    error: configsError,
  } = useConfigurations(applicationId);
  const updateAppMutation = useUpdateApplication();
  const createConfigMutation = useCreateConfiguration();
  const updateConfigMutation = useUpdateConfiguration();
  const deleteConfigMutation = useDeleteConfiguration();

  const configurations = configurationsData?.items || [];

  const handleCreateConfig = () => {
    setEditingConfig(undefined);
    setConfigFormOpen(true);
  };

  const handleEditConfig = (config: Configuration) => {
    setEditingConfig(config);
    setConfigFormOpen(true);
  };

  const handleDeleteConfig = (config: Configuration) => {
    setConfigToDelete(config);
    setDeleteDialogOpen(true);
  };

  const handleConfigFormSubmit = async (
    data: CreateConfigurationRequest | UpdateConfigurationRequest,
  ) => {
    try {
      if (editingConfig) {
        await updateConfigMutation.mutateAsync({
          applicationId,
          configurationId: editingConfig.id,
          data,
        });
      } else {
        await createConfigMutation.mutateAsync({
          applicationId,
          data: data as CreateConfigurationRequest,
        });
      }
      setConfigFormOpen(false);
      setEditingConfig(undefined);
    } catch {
      // Error state is exposed by React Query mutations and rendered below.
    }
  };

  const handleAppFormSubmit = async (data: UpdateApplicationRequest) => {
    try {
      await updateAppMutation.mutateAsync({ id: applicationId, data });
      setAppFormOpen(false);
    } catch {
      // Error state is exposed by React Query mutations and rendered below.
    }
  };

  const handleConfirmDelete = async () => {
    if (!configToDelete) return;

    try {
      await deleteConfigMutation.mutateAsync({
        applicationId,
        configurationId: configToDelete.id,
      });
      setDeleteDialogOpen(false);
      setConfigToDelete(null);
    } catch {
      // Error state is exposed by React Query mutations and rendered below.
    }
  };

  if (appLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (appError || !application) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/applications")}
          sx={{ mb: 2 }}
        >
          Back to Applications
        </Button>
        <Alert severity="error">
          Failed to load application. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate("/applications")}
          sx={{ textDecoration: "none" }}
        >
          Applications
        </Link>
        <Typography color="text.primary">{application.name}</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {application.name}
            </Typography>
            {application.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {application.description}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(application.createdAt).toLocaleDateString()} •
              Updated: {new Date(application.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Button
            startIcon={<EditIcon />}
            onClick={() => setAppFormOpen(true)}
            variant="outlined"
          >
            Edit Application
          </Button>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2">
          Configuration Values
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateConfig}
        >
          Add Configuration
        </Button>
      </Box>

      {configsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load configurations. Please try again.
        </Alert>
      )}

      {(createConfigMutation.error ||
        updateConfigMutation.error ||
        deleteConfigMutation.error ||
        updateAppMutation.error) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {createConfigMutation.error?.message ||
            updateConfigMutation.error?.message ||
            deleteConfigMutation.error?.message ||
            updateAppMutation.error?.message}
        </Alert>
      )}

      {configsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ConfigurationList
          configurations={configurations}
          onEdit={handleEditConfig}
          onDelete={handleDeleteConfig}
        />
      )}

      <ConfigurationForm
        open={configFormOpen}
        configuration={editingConfig}
        onSubmit={handleConfigFormSubmit}
        onCancel={() => {
          setConfigFormOpen(false);
          setEditingConfig(undefined);
        }}
        loading={
          createConfigMutation.isPending || updateConfigMutation.isPending
        }
      />

      <ApplicationForm
        open={appFormOpen}
        application={application}
        onSubmit={handleAppFormSubmit}
        onCancel={() => setAppFormOpen(false)}
        loading={updateAppMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Configuration"
        message={`Are you sure you want to delete the configuration "${configToDelete?.key}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setConfigToDelete(null);
        }}
        confirmText="Delete"
      />
    </Box>
  );
}
