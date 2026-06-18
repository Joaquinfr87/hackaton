import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import DashboardPage from "@/pages/dashboard";
import IncidentsListPage from "@/pages/incidents/list";
import IncidentDetailPage from "@/pages/incidents/detail";
import ReportIncidentPage from "@/pages/incidents/report";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import UsersListPage from "@/pages/users/list";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="incidents" element={<IncidentsListPage />} />
          <Route path="incidents/report" element={<ReportIncidentPage />} />
          <Route path="incidents/:id" element={<IncidentDetailPage />} />
          <Route path="users" element={<UsersListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
