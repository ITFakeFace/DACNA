import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/admin/AdminLayout";
import StudentLayout from "./components/layout/student/StudentLayout";

function Dashboard() {
  return <h2>Admin Dashboard</h2>;
}

function Settings() {
  return <h2>Admin Settings</h2>;
}

function StudentHome() {
  return <h2>Student Home</h2>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Routes cho Admin */}
        Rout
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Routes cho Student */}
        <Route path="/student/*" element={<StudentLayout />}>
          <Route path="home" element={<StudentHome />} />
        </Route>
      </Routes>
    </Router>
  );
}
