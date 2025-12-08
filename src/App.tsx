import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Jobs from "./pages/Jobs";
import JobAssignments from "./pages/JobAssignments";
import TrainingPrograms from "./pages/TrainingPrograms";
import PerformanceCycles from "./pages/PerformanceCycles";
import Appraisals from "./pages/Appraisals";
import Universities from "./pages/Universities";
import Faculties from "./pages/Faculties";
import KPIScores from "./pages/KPIScores";
import Contracts from "./pages/Contracts";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
            <Route path="/job-assignments" element={<ProtectedRoute><JobAssignments /></ProtectedRoute>} />
            <Route path="/training-programs" element={<ProtectedRoute><TrainingPrograms /></ProtectedRoute>} />
            <Route path="/performance-cycles" element={<ProtectedRoute><PerformanceCycles /></ProtectedRoute>} />
            <Route path="/appraisals" element={<ProtectedRoute><Appraisals /></ProtectedRoute>} />
            <Route path="/universities" element={<ProtectedRoute><Universities /></ProtectedRoute>} />
            <Route path="/faculties" element={<ProtectedRoute><Faculties /></ProtectedRoute>} />
            <Route path="/kpi-scores" element={<ProtectedRoute><KPIScores /></ProtectedRoute>} />
            <Route path="/contracts" element={<ProtectedRoute><Contracts /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
