import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DeveloperDashboard from "./pages/developer/DeveloperDashboard";
import TesterDashboard from "./pages/tester/TesterDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Apps from "./pages/developer/Apps";
import DeveloperLayout from "./layouts/DeveloperLayout";
import AddApp from "./pages/developer/AddApp";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppDetails from "./pages/developer/AppDetails";
import CreateTestingSprint from "./pages/developer/CreateTestingSprint";
import SprintDetails from "./pages/developer/SprintDetails";
import TestingSprints from "./pages/developer/TestingSprints";
import AdminLayout from "./layouts/AdminLayout";
import AdminTestingSprints from "./pages/admin/TestingSprints";
import ManageTestingSprint from "./pages/admin/ManageTestingSprint";
import TesterLayout from "./layouts/TesterLayout";
import TesterTestingSprints from "./pages/tester/TestingSprints";
import TesterSprintDetails from "./pages/tester/TesterSprintDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Developer */}
          <Route
            path="/developer/dashboard"
            element={
              <ProtectedRoute allowedRole="developer">
                <DeveloperDashboard />
              </ProtectedRoute>
            }
          />

          {/* Tester */}
          <Route
            path="/tester/dashboard"
            element={
              <ProtectedRoute allowedRole="tester">
                <TesterLayout>
                  <TesterDashboard />
                </TesterLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tester/testing-sprints"
            element={
              <ProtectedRoute allowedRole="tester">
                <TesterLayout>
                  <TesterTestingSprints />
                </TesterLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tester/testing-sprints/:sprintTesterId"
            element={
              <ProtectedRoute allowedRole="tester">
                <TesterLayout>
                  <TesterSprintDetails />
                </TesterLayout>
              </ProtectedRoute>
            }
          />
          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/testing-sprints"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout>
                  <AdminTestingSprints />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/testing-sprints/:sprintId"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout>
                  <ManageTestingSprint />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer/apps"
            element={
              <ProtectedRoute allowedRole="developer">
                <DeveloperLayout>
                  <Apps />
                </DeveloperLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer/apps/add"
            element={
              <ProtectedRoute allowedRole="developer">
                <DeveloperLayout>
                  <AddApp />
                </DeveloperLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer/apps/:appId"
            element={
              <ProtectedRoute allowedRole="developer">
                <DeveloperLayout>
                  <AppDetails />
                </DeveloperLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer/apps/:appId/testing-sprint/create"
            element={
              <ProtectedRoute allowedRole="developer">
                <DeveloperLayout>
                  <CreateTestingSprint />
                </DeveloperLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer/testing-sprints/:sprintId"
            element={
              <ProtectedRoute allowedRole="developer">
                <DeveloperLayout>
                  <SprintDetails />
                </DeveloperLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer/testing-sprints"
            element={
              <ProtectedRoute allowedRole="developer">
                <DeveloperLayout>
                  <TestingSprints />
                </DeveloperLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;