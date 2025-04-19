import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/admin/AdminLayout";
import StudentLayout from "./components/layout/student/StudentLayout";
import GeneralLayout from "./components/layout/general/GeneralLayout";
import LoginPage from "./components/authentication/LoginPage";
import AccountListPage from "./components/authentication/admin/AccountListPage";
import AccountCreatePage from "./components/authentication/admin/AccountCreatePage";
import AccountUpdatePage from "./components/authentication/admin/AccountUpdatePage";
import CourseListPage from "./components/admin/course/CourseListPage";
import CourseCreatePage from "./components/admin/course/CourseCreatePage";
import CourseUpdatePage from "./components/admin/course/CourseUpdatePage";

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
        {/* Mặc định nếu truy cập "/" */}
        <Route path="/" element={<GeneralLayout />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
        {/* Admin */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="accounts" element={<AccountListPage />} />
          <Route path="accounts/create" element={<AccountCreatePage />} />
          <Route path="accounts/update/:id" element={<AccountUpdatePage />} />
          <Route path="courses" element={<CourseListPage />} />
          <Route path="courses/create" element={<CourseCreatePage />} />
          <Route path="courses/update/:id" element={<CourseUpdatePage />} />
        </Route>

        {/* Student */}
        <Route path="/student/*" element={<StudentLayout />}>
          <Route path="home" element={<StudentHome />} />
        </Route>

        {/* Route fallback cho các URL không hợp lệ */}
        <Route path="*" element={<GeneralLayout />} />
      </Routes>
    </Router>
  );
}
