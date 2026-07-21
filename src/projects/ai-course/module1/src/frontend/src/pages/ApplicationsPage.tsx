import { useState } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

import { ApplicationForm } from "../components/ApplicationForm";
import { ApplicationList } from "../components/ApplicationList";
import { ConfirmDialog } from "../components/ConfirmDialog";
import {
  useApplications,
  useCreateApplication,
  useDeleteApplication,
  useUpdateApplication,
} from "../hooks/useApplications";
import type {
  Application,
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from "../types";

export default function ApplicationsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<Application | null>(null);

  const { data: applicationsData, isLoading, error } = useApplications();
  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();

  const applications = applicationsData?.items || [];

  const handleCreate = () => {
    setEditingApp(undefined);
    setFormOpen(true);
  };

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setFormOpen(true);
  };

  const handleDelete = (app: Application) => {
    setAppToDelete(app);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (
    data: CreateApplicationRequest | UpdateApplicationRequest,
  ) => {
    try {
      if (editingApp) {
        await updateMutation.mutateAsync({ id: editingApp.id, data });
      } else {
        await createMutation.mutateAsync(data as CreateApplicationRequest);
      }
      setFormOpen(false);
      setEditingApp(undefined);
    } catch {
      // Error state is exposed by React Query mutations and rendered below.
    }
  };

  const handleConfirmDelete = async () => {
    if (!appToDelete) return;

    try {
      await deleteMutation.mutateAsync(appToDelete.id);
      setDeleteDialogOpen(false);
      setAppToDelete(null);
    } catch {
      // Error state is exposed by React Query mutations and rendered below.
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Applications
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Create Application
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load applications. Please try again.
        </Alert>
      )}

      {(createMutation.error ||
        updateMutation.error ||
        deleteMutation.error) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {createMutation.error?.message ||
            updateMutation.error?.message ||
            deleteMutation.error?.message}
        </Alert>
      )}

      <ApplicationList
        applications={applications}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ApplicationForm
        open={formOpen}
        application={editingApp}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setFormOpen(false);
          setEditingApp(undefined);
        }}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Application"
        message={`Are you sure you want to delete "${appToDelete?.name}"? This will also delete all its configuration values.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setAppToDelete(null);
        }}
        confirmText="Delete"
      />
    </Box>
  );
}
