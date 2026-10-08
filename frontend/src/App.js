import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NotePage from "./pages/NotePage";
import NoteEditor from "../src/components/notes/NoteEditor.jsx";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetOtp from "./pages/VerifyResetOtp";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import SharedNote from "./pages/SharedNote";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Shared Note - Public */}
        <Route path="/share/:token" element={<SharedNote />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes/new" element={<NoteEditor />} />
          <Route path="/notes/:id/edit" element={<NoteEditor />} />
          <Route path="/notes/:id" element={<NotePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
