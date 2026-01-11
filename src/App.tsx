import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import SeedDatabase from "./pages/dev/SeedDatabase";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import SupervisorSelection from "./pages/student/SupervisorSelection";
import GroupManagement from "./pages/student/GroupManagement";
import ProjectIdea from "./pages/student/ProjectIdea";
import DocumentUpload from "./pages/student/DocumentUpload";
import ProgressTracking from "./pages/student/ProgressTracking";
import Announcements from "./pages/student/Announcements";
import Evaluation from "./pages/student/Evaluation";
import StudentProfile from "./pages/student/StudentProfile";

// Supervisor Pages
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard";
import SupervisionRequests from "./pages/supervisor/SupervisionRequests";
import AssignedGroups from "./pages/supervisor/AssignedGroups";
import IdeaReview from "./pages/supervisor/IdeaReview";
import DocumentReview from "./pages/supervisor/DocumentReview";
import SupervisorEvaluation from "./pages/supervisor/SupervisorEvaluation";
import SupervisorAnnouncements from "./pages/supervisor/SupervisorAnnouncements";

// PMO Pages
import PMODashboard from "./pages/pmo/PMODashboard";
import ProjectApproval from "./pages/pmo/ProjectApproval";
import UserManagement from "./pages/pmo/UserManagement";
import PMOAnnouncements from "./pages/pmo/PMOAnnouncements";
import SupervisorAssignment from "./pages/pmo/SupervisorAssignment";
import ProgressMonitor from "./pages/pmo/ProgressMonitor";
import Templates from "./pages/pmo/Templates";
import Reports from "./pages/pmo/Reports";

// External Panel Pages
import ExternalDashboard from "./pages/external/ExternalDashboard";
import EvaluateGroups from "./pages/external/EvaluateGroups";

// Exam Cell Pages
import ExamCellDashboard from "./pages/exam-cell/ExamCellDashboard";
import CompileResults from "./pages/exam-cell/CompileResults";
import PublishResults from "./pages/exam-cell/PublishResults";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoleManagement from "./pages/admin/RoleManagement";
import AcademicConfig from "./pages/admin/AcademicConfig";
import AuditLogs from "./pages/admin/AuditLogs";

const queryClient = new QueryClient();

const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-4xl font-bold text-destructive">403 Unauthorized</h1>
    <p className="text-muted-foreground mt-4">You do not have permission to access this page.</p>
    <a href="/login" className="mt-4 text-primary hover:underline">Return to Login</a>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Dev Tools */}
            <Route path="/dev/seed" element={<SeedDatabase />} />

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
              <Route path="/student/dashboard" element={<AppLayout><StudentDashboard /></AppLayout>} />
              <Route path="/student/supervisor" element={<AppLayout><SupervisorSelection /></AppLayout>} />
              <Route path="/student/group" element={<AppLayout><GroupManagement /></AppLayout>} />
              <Route path="/student/project" element={<AppLayout><ProjectIdea /></AppLayout>} />
              <Route path="/student/documents" element={<AppLayout><DocumentUpload /></AppLayout>} />
              <Route path="/student/progress" element={<AppLayout><ProgressTracking /></AppLayout>} />
              <Route path="/student/announcements" element={<AppLayout><Announcements /></AppLayout>} />
              <Route path="/student/evaluation" element={<AppLayout><Evaluation /></AppLayout>} />
              <Route path="/student/profile" element={<AppLayout><StudentProfile /></AppLayout>} />
            </Route>

            {/* Supervisor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['supervisor']} />}>
              <Route path="/supervisor" element={<Navigate to="/supervisor/dashboard" replace />} />
              <Route path="/supervisor/dashboard" element={<AppLayout><SupervisorDashboard /></AppLayout>} />
              <Route path="/supervisor/requests" element={<AppLayout><SupervisionRequests /></AppLayout>} />
              <Route path="/supervisor/groups" element={<AppLayout><AssignedGroups /></AppLayout>} />
              <Route path="/supervisor/ideas" element={<AppLayout><IdeaReview /></AppLayout>} />
              <Route path="/supervisor/documents" element={<AppLayout><DocumentReview /></AppLayout>} />
              <Route path="/supervisor/evaluation" element={<AppLayout><SupervisorEvaluation /></AppLayout>} />
              <Route path="/supervisor/announcements" element={<AppLayout><SupervisorAnnouncements /></AppLayout>} />
            </Route>

            {/* PMO Routes */}
            <Route element={<ProtectedRoute allowedRoles={['pmo']} />}>
              <Route path="/pmo" element={<Navigate to="/pmo/dashboard" replace />} />
              <Route path="/pmo/dashboard" element={<AppLayout><PMODashboard /></AppLayout>} />
              <Route path="/pmo/approvals" element={<AppLayout><ProjectApproval /></AppLayout>} />
              <Route path="/pmo/users" element={<AppLayout><UserManagement /></AppLayout>} />
              <Route path="/pmo/announcements" element={<AppLayout><PMOAnnouncements /></AppLayout>} />
              <Route path="/pmo/assignments" element={<AppLayout><SupervisorAssignment /></AppLayout>} />
              <Route path="/pmo/progress" element={<AppLayout><ProgressMonitor /></AppLayout>} />
              <Route path="/pmo/templates" element={<AppLayout><Templates /></AppLayout>} />
              <Route path="/pmo/reports" element={<AppLayout><Reports /></AppLayout>} />
            </Route>

            {/* External Panel Routes */}
            <Route element={<ProtectedRoute allowedRoles={['external_panel']} />}>
              <Route path="/external" element={<Navigate to="/external/dashboard" replace />} />
              <Route path="/external/dashboard" element={<AppLayout><ExternalDashboard /></AppLayout>} />
              <Route path="/external/evaluate" element={<AppLayout><EvaluateGroups /></AppLayout>} />
            </Route>

            {/* Exam Cell Routes */}
            <Route element={<ProtectedRoute allowedRoles={['exam_cell']} />}>
              <Route path="/exam-cell" element={<Navigate to="/exam-cell/dashboard" replace />} />
              <Route path="/exam-cell/dashboard" element={<AppLayout><ExamCellDashboard /></AppLayout>} />
              <Route path="/exam-cell/compile" element={<AppLayout><CompileResults /></AppLayout>} />
              <Route path="/exam-cell/publish" element={<AppLayout><PublishResults /></AppLayout>} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'hod']} />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AppLayout><AdminDashboard /></AppLayout>} />
              <Route path="/admin/roles" element={<AppLayout><RoleManagement /></AppLayout>} />
              <Route path="/admin/config" element={<AppLayout><AcademicConfig /></AppLayout>} />
              <Route path="/admin/logs" element={<AppLayout><AuditLogs /></AppLayout>} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
