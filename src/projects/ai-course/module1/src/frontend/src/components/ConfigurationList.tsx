import type { MouseEvent } from "react";
import { useState } from "react";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { Configuration } from "../types";

interface ConfigurationListProps {
  configurations: Configuration[];
  onEdit: (configuration: Configuration) => void;
  onDelete: (configuration: Configuration) => void;
}

export const ConfigurationList = ({
  configurations,
  onEdit,
  onDelete,
}: ConfigurationListProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedConfig, setSelectedConfig] = useState<Configuration | null>(
    null,
  );

  const handleMenuOpen = (
    event: MouseEvent<HTMLElement>,
    config: Configuration,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedConfig(config);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedConfig(null);
  };

  const handleEdit = () => {
    if (selectedConfig) {
      onEdit(selectedConfig);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedConfig) {
      onDelete(selectedConfig);
    }
    handleMenuClose();
  };

  const formatValue = (value: unknown) => {
    const valueText = JSON.stringify(value);
    return valueText.length > 100
      ? `${valueText.substring(0, 100)}...`
      : valueText;
  };

  const getValueType = (value: unknown) => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  };

  if (configurations.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No configurations found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add configuration values for this application
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell width={50} />
            </TableRow>
          </TableHead>
          <TableBody>
            {configurations.map((config) => (
              <TableRow key={config.id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    {config.key}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      maxWidth: 300,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatValue(config.value)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getValueType(config.value)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {config.description || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(config.updatedAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(event) => handleMenuOpen(event, config)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};
