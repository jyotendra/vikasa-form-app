import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Login } from "./components/Login";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import PersistentLayout from "./components/PersistentLayout";
import Home from "./components/Home";
import FarmerDetail from "./components/forms/farmer-detail";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { validateEnvVariables } from "./helpers/env";
import { SnackbarProvider } from "notistack";
import AppForms from "./components/forms";

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

function App() {
  useEffect(() => {
    validateEnvVariables();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <Router>
          <Routes>
            {/* Public Route: Login page (accessible only if not authenticated) */}
            <Route
              path="/"
              element={
                <ProtectedRoute requiredAuth={false}>
                  <Login />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes: Accessible only if authenticated.
              These routes use the persistent layout. */}
            <Route
              path="/"
              element={
                <ProtectedRoute requiredAuth={true}>
                  <PersistentLayout />
                </ProtectedRoute>
              }
            >
              <Route path="home" element={<Home />} />
              <Route path="form/*" element={<AppForms />} />
              {/* Fallback: any unmatched route under authenticated area redirects to /home */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
          </Routes>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
