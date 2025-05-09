import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/admin/AdminLayout";
import StudentLayout from "./components/layout/student/StudentLayout";
import GeneralLayout from "./components/layout/general/GeneralLayout";
import LoginPage from "./components/authentication/LoginPage";
import AccountListPage from "./components/authentication/admin/AccountListPage";
import CourseListPage from "./components/admin/course/CourseListPage";
// import { useEffect } from "react";
// import { getRoleFromToken, isTokenValid } from "./services/authService";
import AccountFormPage from "./components/authentication/admin/AccountFormPage";
import CourseFormPage from "./components/admin/course/CourseFormPage";
import CourseDetailsPage from "./components/admin/course/CourseDetailsPage";
import EnrollmentStaffLayout from "./components/layout/enrollment-staff/EnrollmentStaffLayout";
import TeacherLayout from "./components/layout/teacher/TeacherLayout";
import AcademicAdminLayout from "./components/layout/academic-admin/AcademicAdminLayout";
import ProtectedRoute from "./components/layout/components/ProtectedRoute";
import HomePage from "./components/homepage/HomePage";
import EducationalInformationPage from "./components/EducationalInformationPage/EducationalInformationPage";
import ClassroomListPage from "./components/admin/classroom/ClassroomListPage";
import ClassroomFormPage from "./components/admin/classroom/ClassroomFormPage";


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
  return (
    <Router>
      <Routes>
        {/* General route */}
        <Route path="/" element={<GeneralLayout />}>
          <Route path="" index element={<HomePage />} />
          <Route path="educational-information" index element={<EducationalInformationPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="accounts" element={<AccountListPage />} />
            <Route path="accounts/create" element={<AccountFormPage />} />
            <Route path="accounts/update/:id" element={<AccountFormPage />} />
            <Route path="courses" element={<CourseListPage />} />
            <Route path="courses/:id" element={<CourseDetailsPage />} />
            <Route path="courses/create" element={<CourseFormPage />} />
            <Route path="courses/update/:id" element={<CourseFormPage />} />
            <Route path="class" element={<ClassroomListPage />} />
            <Route path="class/create" element={<ClassroomFormPage />} />
            
            
          </Route>
        </Route>

        {/* Academic Admin */}
        <Route element={<ProtectedRoute requiredRole="ACADEMIC_ADMIN" />}>
          <Route path="/academic-admin" element={<AcademicAdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<CourseListPage />} />
          </Route>
        </Route>

        {/* Enrollment Staff */}
        <Route element={<ProtectedRoute requiredRole="ENROLLMENT_STAFF" />}>
          <Route path="/enrollment-staff" element={<EnrollmentStaffLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        {/* Teacher */}
        <Route element={<ProtectedRoute requiredRole="TEACHER" />}>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        {/* Student */}
        <Route element={<ProtectedRoute requiredRole="STUDENT" />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route path="home" element={<StudentHome />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<GeneralLayout />} />
      </Routes>
    </Router>
  );
}
