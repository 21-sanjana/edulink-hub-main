import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { ChatProvider } from "@/context/ChatContext";
import { TimetableProvider } from "@/context/TimetableContext";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Faculty
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyCourses from "./pages/faculty/FacultyCourses";
import FacultyMaterials from "./pages/faculty/FacultyMaterials";
import FacultyAssignments from "./pages/faculty/FacultyAssignments";
import FacultyAttendance from "./pages/faculty/FacultyAttendance";
import FacultyPerformance from "./pages/faculty/FacultyPerformance";
import FacultySyllabus from "./pages/faculty/FacultySyllabus";
import FacultyVirtualClasses from "./pages/faculty/FacultyVirtualClasses";
import FacultyQuiz from "./pages/faculty/FacultyQuiz";
import FacultyProfile from "./pages/faculty/FacultyProfile";
import FacultyChat from "./pages/faculty/FacultyChat";
import FacultyMentoring from "./pages/faculty/FacultyMentoring";
import FacultyTimetable from "./pages/faculty/FacultyTimetable";
import FacultyCalendar from "./pages/faculty/FacultyCalendar";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentMaterials from "./pages/student/StudentMaterials";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentQuiz from "./pages/student/StudentQuiz";
import StudentScores from "./pages/student/StudentScores";
import StudentSyllabus from "./pages/student/StudentSyllabus";
import StudentVirtualClasses from "./pages/student/StudentVirtualClasses";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentProfile from "./pages/student/StudentProfile";
import StudentChat from "./pages/student/StudentChat";
import StudentMentoring from "./pages/student/StudentMentoring";
import StudentTimetable from "./pages/student/StudentTimetable";
import StudentCalendar from "./pages/student/StudentCalendar";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role: string }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated
          ? <Navigate to={user?.role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard'} replace />
          : <LoginPage />
      } />

      {/* Faculty Routes */}
      <Route path="/faculty/dashboard" element={<ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>} />
      <Route path="/faculty/courses" element={<ProtectedRoute role="faculty"><FacultyCourses /></ProtectedRoute>} />
      <Route path="/faculty/materials" element={<ProtectedRoute role="faculty"><FacultyMaterials /></ProtectedRoute>} />
      <Route path="/faculty/assignments" element={<ProtectedRoute role="faculty"><FacultyAssignments /></ProtectedRoute>} />
      <Route path="/faculty/attendance" element={<ProtectedRoute role="faculty"><FacultyAttendance /></ProtectedRoute>} />
      <Route path="/faculty/performance" element={<ProtectedRoute role="faculty"><FacultyPerformance /></ProtectedRoute>} />
      <Route path="/faculty/syllabus" element={<ProtectedRoute role="faculty"><FacultySyllabus /></ProtectedRoute>} />
      <Route path="/faculty/quiz" element={<ProtectedRoute role="faculty"><FacultyQuiz /></ProtectedRoute>} />
      <Route path="/faculty/virtual-classes" element={<ProtectedRoute role="faculty"><FacultyVirtualClasses /></ProtectedRoute>} />
      <Route path="/faculty/profile" element={<ProtectedRoute role="faculty"><FacultyProfile /></ProtectedRoute>} />
      <Route path="/faculty/chat" element={<ProtectedRoute role="faculty"><FacultyChat /></ProtectedRoute>} />
      <Route path="/faculty/mentoring" element={<ProtectedRoute role="faculty"><FacultyMentoring /></ProtectedRoute>} />
      <Route path="/faculty/timetable" element={<ProtectedRoute role="faculty"><FacultyTimetable /></ProtectedRoute>} />
      <Route path="/faculty/calendar" element={<ProtectedRoute role="faculty"><FacultyCalendar /></ProtectedRoute>} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/courses" element={<ProtectedRoute role="student"><StudentCourses /></ProtectedRoute>} />
      <Route path="/student/materials" element={<ProtectedRoute role="student"><StudentMaterials /></ProtectedRoute>} />
      <Route path="/student/assignments" element={<ProtectedRoute role="student"><StudentAssignments /></ProtectedRoute>} />
      <Route path="/student/attendance" element={<ProtectedRoute role="student"><StudentAttendance /></ProtectedRoute>} />
      <Route path="/student/quiz" element={<ProtectedRoute role="student"><StudentQuiz /></ProtectedRoute>} />
      <Route path="/student/scores" element={<ProtectedRoute role="student"><StudentScores /></ProtectedRoute>} />
      <Route path="/student/syllabus" element={<ProtectedRoute role="student"><StudentSyllabus /></ProtectedRoute>} />
      <Route path="/student/virtual-classes" element={<ProtectedRoute role="student"><StudentVirtualClasses /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/chat" element={<ProtectedRoute role="student"><StudentChat /></ProtectedRoute>} />
      <Route path="/student/mentoring" element={<ProtectedRoute role="student"><StudentMentoring /></ProtectedRoute>} />
      <Route path="/student/timetable" element={<ProtectedRoute role="student"><StudentTimetable /></ProtectedRoute>} />
      <Route path="/student/calendar" element={<ProtectedRoute role="student"><StudentCalendar /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <ChatProvider>
        <TimetableProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
        </TimetableProvider>
        </ChatProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
