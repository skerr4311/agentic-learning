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
  Typography,
} from "@mui/material";

import type {
  Configuration,
  CreateConfigurationRequest,
  UpdateConfigurationRequest,
} from "../types";

interface ConfigurationFormProps {
  open: boolean;
  configuration?: Configuration;
  onSubmit: (
    data: CreateConfigurationRequest | UpdateConfigurationRequest,
  ) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfigurationForm = ({
  open,
  configuration,
  onSubmit,
  onCancel,
  loading = false,
}: ConfigurationFormProps) => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [valueError, setValueError] = useState("");

  useEffect(() => {
    if (configuration) {
      setKey(configuration.key);
      setValue(JSON.stringify(configuration.value, null, 2));
      setDescription(configuration.description || "");
    } else {
      setKey("");
      setValue("");
      setDescription("");
    }
    setValueError("");
  }, [configuration, open]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    try {
      const parsedValue = JSON.parse(value);
      onSubmit({
        key: key.trim(),
        value: parsedValue,
        description: description.trim() || undefined,
      });
      setValueError("");
    } catch {
      setValueError("Invalid JSON format");
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>
          {configuration ? "Edit Configuration" : "Create Configuration"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Key"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              required
              fullWidth
              disabled={loading}
              placeholder="e.g., api.timeout"
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Value (JSON format)
              </Typography>
              <TextField
                value={value}
                onChange={(event) => setValue(event.target.value)}
                required
                fullWidth
                multiline
                rows={6}
                disabled={loading}
                placeholder='e.g., {"timeout": 5000, "retries": 3}'
                error={Boolean(valueError)}
                helperText={valueError || "Enter a valid JSON value"}
              />
            </Box>
            <TextField
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              multiline
              rows={2}
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
            disabled={loading || !key.trim() || !value.trim()}
          >
            {configuration ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
