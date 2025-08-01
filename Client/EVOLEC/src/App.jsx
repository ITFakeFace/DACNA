import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/admin/AdminLayout";
import StudentLayout from "./components/layout/student/StudentLayout";
import GeneralLayout from "./components/layout/general/GeneralLayout";
import LoginPage from "./components/authentication/LoginPage";
import AccountListPage from "./components/authentication/admin/AccountListPage";
import CourseListPage from "./components/admin/course/CourseListPage";
import AccountFormPage from "./components/authentication/admin/AccountFormPage";
import CourseFormPage from "./components/admin/course/CourseFormPage";
import CourseDetailsPage from "./components/admin/course/CourseDetailsPage";
import EnrollmentStaffLayout from "./components/layout/enrollment-staff/EnrollmentStaffLayout";
import TeacherLayout from "./components/layout/teacher/TeacherLayout";
import AcademicAdminLayout from "./components/layout/academic-admin/AcademicAdminLayout";
import ProtectedRoute from "./components/layout/components/ProtectedRoute";
import HomePage from "./components/homepage/HomePage";
import ClassroomListPage from "./components/admin/classroom/ClassroomListPage";
import ClassroomFormPage from "./components/admin/classroom/ClassroomFormPage";
import ClassroomDetailsPage from "./components/admin/classroom/ClassroomDetailsPage";
import EducationalInformationPage from "./components/educational-information-page/EducationalInformationPage";
import AboutUsPage from "./components/about-us-page/AboutUsPage";
import ForgotPasswordPage from "./components/authentication/ForgotPasswordPage";
import OffDateListPage from "./components/admin/off-date/OffDateListPage";
import OffDateDetailsPage from "./components/admin/off-date/OffDateDetailsPage";
import RoomListPage from "./components/admin/room/RoomListPage";
import RoomDetailsPage from "./components/admin/room/RoomDetailsPage";
import StudentProfile from "./components/student/StudentProfile"
import EnrollmentsListPage from "./components/enrollment-staff/EnrollmentsListPage";
import EnrollmentsCreateForm from "./components/enrollment-staff/EnrollmentsCreateForm";
import StudentDashboard from "./components/student/dashboard/StudentDashboard";
import StudentLessonDateDetails from "./components/student/lesson-date/StudentLessonDateDetails";
import TeacherDashboard from "./components/teacher/dashboard/TeacherDashboard";
import TeacherLessonDateDetails from "./components/teacher/lesson-date/TeacherLessonDateDetails";
import LessonDateDetailsPage from "./components/admin/lesson-date/LessonDateDetailsPage";
import AccountDetailsPage from "./components/authentication/admin/AccountDetailsPage";
import AcademicAdminCourseListPage from "./components/academic-admin/course/AcademicAdminCourseListPage";
import AcademicAdminCourseDetailsPage from "./components/academic-admin/course/AcademicAdminCourseDetailsPage";
import AcademicAdminCourseFormPage from "./components/academic-admin/course/AcademicAdminCourseFormPage";
import TeacherProfile from "./components/teacher/profile/TeacherProfile";
import AdminDashboard from "./components/admin/dashboard/AdminDashboard";
import AdminEnrollmentsListPage from "./components/admin/enrollment/Admin_EnrollmentsListPage";
import AdminEnrollmentsCreateForm from "./components/admin/enrollment/Admin_EnrollmentsCreateForm";

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
          <Route path="about-us" index element={<AboutUsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="settings" element={<Settings />} />

            <Route path="accounts" element={<AccountListPage />} />
            <Route path="accounts/:id" element={<AccountDetailsPage />} />
            <Route path="accounts/create" element={<AccountFormPage />} />
            <Route path="accounts/update/:id" element={<AccountFormPage />} />

            <Route path="courses" element={<CourseListPage />} />
            <Route path="courses/:id" element={<CourseDetailsPage />} />
            <Route path="courses/create" element={<CourseFormPage />} />
            <Route path="courses/update/:id" element={<CourseFormPage />} />

            <Route path="classrooms" element={<ClassroomListPage />} />
            <Route path="classrooms/:id" element={<ClassroomDetailsPage />} />
            <Route path="classrooms/create" element={<ClassroomFormPage />} />
            <Route path="classrooms/update/:id" element={<ClassroomFormPage />} />

            <Route path="off-dates" element={<OffDateListPage />} />
            <Route path="off-dates/:id" element={<OffDateDetailsPage />} />
            <Route path="rooms" element={<RoomListPage />} />
            <Route path="rooms/:id" element={<RoomDetailsPage />} />
            <Route path="lesson-dates/:id" element={<LessonDateDetailsPage />} />

            <Route path="enrollments" element={<AdminEnrollmentsListPage />} />
            <Route path="enrollments/create" element={<AdminEnrollmentsCreateForm />} />
            <Route path="enrollments/update/:id" element={<AdminEnrollmentsCreateForm />} />
          </Route>
        </Route>

        {/* Academic Admin */}
        <Route element={<ProtectedRoute requiredRole="ACADEMIC_ADMIN" />}>
          <Route path="/academic-admin" element={<AcademicAdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<AcademicAdminCourseListPage />} />
            <Route path="courses/:id" element={<AcademicAdminCourseDetailsPage />} />
            <Route path="courses/create" element={<AcademicAdminCourseFormPage />} />
            <Route path="courses/update/:id" element={<AcademicAdminCourseFormPage />} />
          </Route>
        </Route>

        {/* Enrollment Staff */}
        <Route element={<ProtectedRoute requiredRole="ENROLLMENT_STAFF" />}>
          <Route path="/enrollment-staff" element={<EnrollmentStaffLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="enrollments" element={<EnrollmentsListPage />} />
            <Route path="enrollments/create" element={<EnrollmentsCreateForm />} />
            <Route path="enrollments/update/:id" element={<EnrollmentsCreateForm />} />
          </Route>
        </Route>

        {/* Teacher */}
        <Route element={<ProtectedRoute requiredRole="TEACHER" />}>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route path="" element={<TeacherDashboard />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="lesson-date/:id" element={<TeacherLessonDateDetails />} />
          </Route>
        </Route>

        {/* Student */}
        <Route element={<ProtectedRoute requiredRole="STUDENT" />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route path="" element={<StudentDashboard />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="lesson-date/:id" element={<StudentLessonDateDetails />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<GeneralLayout />} />
      </Routes>
    </Router>
  );
}
