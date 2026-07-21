import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";

const ApplicationsPagePlaceholder = () => (
  <Typography variant="h4" component="h1">
    Applications
  </Typography>
);

const ApplicationDetailsPagePlaceholder = () => (
  <Typography variant="h4" component="h1">
    Application Details
  </Typography>
);

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
          <Route
            path="/applications"
            element={<ApplicationsPagePlaceholder />}
          />
          <Route
            path="/applications/:applicationId"
            element={<ApplicationDetailsPagePlaceholder />}
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;
