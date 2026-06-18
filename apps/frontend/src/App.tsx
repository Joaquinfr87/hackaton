import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import DashboardPage from "@/pages/dashboard";
import IncidentsListPage from "@/pages/incidents/list";
import IncidentDetailPage from "@/pages/incidents/detail";
import ReportIncidentPage from "@/pages/incidents/report";
import AuthPage from "@/pages/auth/login";
import UsersListPage from "@/pages/users/list";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="incidents" element={<IncidentsListPage />} />
            <Route path="incidents/report" element={<ReportIncidentPage />} />
            <Route path="incidents/:id" element={<IncidentDetailPage />} />
            <Route element={<AdminRoute />}>
              <Route path="users" element={<UsersListPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
