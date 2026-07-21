import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";

import ApplicationDetailsPage from "./pages/ApplicationDetailsPage";
import ApplicationsPage from "./pages/ApplicationsPage";

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Configuration Service
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/applications" replace />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route
            path="/applications/:applicationId"
            element={<ApplicationDetailsPage />}
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;
