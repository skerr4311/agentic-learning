import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import type {
  Application,
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from "../types";

interface ApplicationFormProps {
  open: boolean;
  application?: Application;
  onSubmit: (data: CreateApplicationRequest | UpdateApplicationRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ApplicationForm = ({
  open,
  application,
  onSubmit,
  onCancel,
  loading = false,
}: ApplicationFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (application) {
      setName(application.name);
      setDescription(application.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [application, open]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>
          {application ? "Edit Application" : "Create Application"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              multiline
              rows={3}
              fullWidth
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !name.trim()}
          >
            {application ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
