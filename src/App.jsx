import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CompanyList from "./pages/CompanyList";
import CompanyDetails from "./pages/CompanyDetails";
import JobManagement from "./pages/JobManagement";
import JobDetails from "./pages/JobDetails";
import JobSearch from "./pages/JobSearch";
import CandidateProfile from "./pages/CandidateProfile";
import ApplicationsHub from "./pages/ApplicationsHub";
import Reports from "./pages/Reports";

function AppLayout() {
  const location = useLocation();

  // Hide top public navbar on auth pages & app pages that use the enterprise sidebar (DashboardLayout)
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isAppDashboard =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/companies") ||
    location.pathname.startsWith("/jobs") ||
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/applications") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/reports");

  const shouldShowNavbar = !isAuthPage && !isAppDashboard;

  return (
    <div
      className={`${isAppDashboard ? "h-screen max-h-screen overflow-hidden" : "min-h-screen"} flex flex-col bg-slate-50 text-slate-900 font-sans antialiased`}
    >
      {shouldShowNavbar && <Navbar />}
      <div className="flex-1 flex flex-col min-h-0">
        <Routes>
          {/* First screen: Directly redirect to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public-only Auth Pages (redirect to /dashboard if logged in) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes - Module 2: Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Module 3: Company Management */}
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <CompanyList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies/:id"
            element={
              <ProtectedRoute>
                <CompanyDetails />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Module 4: Job Posting Management */}
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobManagement />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Module 5: Candidate Job Search Engine */}
          <Route
            path="/jobs/search"
            element={
              <ProtectedRoute>
                <JobSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <JobSearch />
              </ProtectedRoute>
            }
          />

          {/* Job Details View */}
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Module 6: Candidate Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <CandidateProfile />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Module 7: Applications & Saved Jobs */}
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <ApplicationsHub />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Module 8: Reports & Analytics */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AuthProvider>
  );
}
