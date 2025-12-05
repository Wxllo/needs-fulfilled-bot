import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job-assignments" element={<JobAssignments />} />
          <Route path="/training-programs" element={<TrainingPrograms />} />
          <Route path="/performance-cycles" element={<PerformanceCycles />} />
          <Route path="/appraisals" element={<Appraisals />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/kpi-scores" element={<KPIScores />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
