import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "@/components/RequireAuth";
import AuthPage from "@/pages/AuthPage";
import CaptainDashboard from "@/pages/CaptainDashboard";
import LandingPage from "@/pages/LandingPage";
import { AuthProvider } from "@/store/auth";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/captain"
            element={
              <RequireAuth>
                <CaptainDashboard />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
