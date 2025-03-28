import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react"; 
import FloatingShape from "./components/FloatingShape";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashBoardPage from "./pages/DashBoardPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/LoadingSpinner";
import AssignedTicket from "./pages/AssignedTicket";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import TicketPage from "./pages/TicketPage";
import Department from "./pages/Department";
import Users from "./pages/UserManagement";
import AdminTickets from "./pages/AdminTickets";
import AboutPage from "./pages/AboutPage";
import Chatbot from "./pages/ChatBot";
// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};
// Admin protected Routes
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />; // Redirect non-admin users
  }

  return children;
};
const StaffProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (user.role !== "admin" && user.role !== "staff") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
// Redirect authenticated users to the home page or dashboard
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const [isChatbotOpen, setChatbotOpen] = useState(false); // ✅ Correct Placement

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="50%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="10%"
        delay={2}
      />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submitTicket"
          element={
            <ProtectedRoute>
              <TicketPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/signTicket"
          element={
            <StaffProtectedRoute>
              <AssignedTicket />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/department"
          element={
            <AdminProtectedRoute>
              <Department />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminProtectedRoute>
              <Users />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/adminTickets"
          element={
            <AdminProtectedRoute>
              <AdminTickets />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignupPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        {/* Redirect all unmatched routes to the home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <button
        className="fixed bottom-5 right-5 p-4  text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
        style={{ background: "#48bb78" }}
        onMouseEnter={(e) => (e.target.style.background = "#38a169")} 
        onMouseLeave={(e) => (e.target.style.background = "#48bb78")} 
        onClick={() => setChatbotOpen(!isChatbotOpen)}
      >
        {isChatbotOpen ? (
          <span className="material-symbols-rounded">close</span>
        ) : (
          <span className="material-symbols-rounded">mode_comment</span>
        )}
      </button>

      {/* Chatbot Component - Show when open */}
      {isChatbotOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="w-96 h-[500px] rounded-lg shadow-lg p-4 relative">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        onClick={() => setChatbotOpen(false)}
      >
        <span className="material-symbols-rounded text-2xl">close</span>
      </button>
      <Chatbot setChatbotOpen={setChatbotOpen} />
    </div>
  </div>
)}
      <Toaster />
    </div>
  );
}
