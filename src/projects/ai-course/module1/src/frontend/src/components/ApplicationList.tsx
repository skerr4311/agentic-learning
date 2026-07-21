import type { MouseEvent } from "react";
import { useState } from "react";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import type { Application } from "../types";

interface ApplicationListProps {
  applications: Application[];
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
}

export const ApplicationList = ({
  applications,
  onEdit,
  onDelete,
}: ApplicationListProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>, app: Application) => {
    setAnchorEl(event.currentTarget);
    setSelectedApp(app);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedApp(null);
  };

  const handleEdit = () => {
    if (selectedApp) {
      onEdit(selectedApp);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedApp) {
      onDelete(selectedApp);
    }
    handleMenuClose();
  };

  if (applications.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No applications found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first application to get started
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {applications.map((app) => (
          <Card key={app.id}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography variant="h6" component="h2" gutterBottom>
                  {app.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(event) => handleMenuOpen(event, app)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
              {app.description && (
                <Typography variant="body2" color="text.secondary">
                  {app.description}
                </Typography>
              )}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Created: {new Date(app.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate(`/applications/${app.id}`)}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

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
