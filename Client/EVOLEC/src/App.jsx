import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AdminLayout from "./components/layout/admin/AdminLayout";
import StudentLayout from "./components/layout/student/StudentLayout";
import GeneralLayout from "./components/layout/general/GeneralLayout";
import LoginPage from "./components/authentication/LoginPage";
import AccountListPage from "./components/authentication/admin/AccountListPage";
import CourseListPage from "./components/admin/course/CourseListPage";
import { useEffect } from "react";
import { getRoleFromToken, isTokenValid } from "./services/authService";
import AccountFormPage from "./components/authentication/admin/AccountFormPage";
import CourseFormPage from "./components/admin/course/CourseFormPage";
import CourseDetailsPage from "./components/admin/course/CourseDetailsPage";
import EnrollmentStaffLayout from "./components/layout/enrollment-staff/EnrollmentStaffLayout";
import TeacherLayout from "./components/layout/teacher/TeacherLayout";
import AcademicAdminLayout from "./components/layout/academic-admin/AcademicAdminLayout";

function Dashboard() {
  return <h2>Dashboard Page</h2>;
}

function Settings() {
  return <h2>Settings Page</h2>;
}

function StudentHome() {
  return <h2>Student Home</h2>;
}

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const pathname = window.location.pathname;

    const isProtectedRoute = pathname.startsWith("/admin") ||
      pathname.startsWith("/student") ||
      pathname.startsWith("/staff");
    if (token && !isTokenValid(token)) {
      localStorage.removeItem("token")
      if (isProtectedRoute) {
        window.location.href = "/";
      }
    }
    const rawRole = getRoleFromToken(token);
    const role = rawRole ? rawRole.toString().toUpperCase() : null;
    if (!role)
      return;
    if (role != "ADMIN" && pathname.startsWith("/admin")) {
      console.log("Required Specific Permission to Access (ADM)")
      window.location.href = "/login";
    }
    if (role != "ACADEMIC_ADMIN" && pathname.startsWith("/academic-admin")) {
      console.log("Required Specific Permission to Access (ACA_ADM)")
      window.location.href = "/login";
    }
    if (role != "ENROLLMENT_STAFF" && pathname.startsWith("/enrollment-staff")) {
      console.log("Required Specific Permission to Access (STF)")
      window.location.href = "/login";
    }
    if (role != "TEACHER" && pathname.startsWith("/teacher")) {
      console.log("Required Specific Permission to Access (TCH)")
      window.location.href = "/login";
    }
    if (role != "STUDENT" && pathname.startsWith("/student")) {
      console.log("Required Specific Permission to Access (STD)");
      window.location.href = "/login";
    }
  }, []);
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
          <Route path="accounts/create" element={<AccountFormPage />} />
          <Route path="accounts/update/:id" element={<AccountFormPage />} />
          <Route path="courses" element={<CourseListPage />} />
          <Route path="courses/:id" element={<CourseDetailsPage />} />
          <Route path="courses/create" element={<CourseFormPage />} />
          <Route path="courses/update/:id" element={<CourseFormPage />} />
        </Route>
        <Route path="/academic-admin/*" element={<AcademicAdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/enrollment-staff/*" element={<EnrollmentStaffLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/teacher/*" element={<TeacherLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
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
