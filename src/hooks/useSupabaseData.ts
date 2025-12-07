import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Types
export type University = Tables<'universities'>;
export type Faculty = Tables<'faculties'>;
export type Department = Tables<'departments'>;
export type Employee = Tables<'employees'>;
export type Job = Tables<'jobs'>;
export type JobAssignment = Tables<'job_assignments'>;
export type Contract = Tables<'contracts'>;
export type TrainingProgram = Tables<'training_programs'>;
export type PerformanceCycle = Tables<'performance_cycles'>;
export type Appraisal = Tables<'appraisals'>;
export type KPIScore = Tables<'kpi_scores'>;

// Universities
export function useUniversities() {
  return useQuery({
    queryKey: ['universities'],
    queryFn: async () => {
      const { data, error } = await supabase.from('universities').select('*').order('name');
      if (error) throw error;
      return data as University[];
    },
  });
}

export function useCreateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (university: TablesInsert<'universities'>) => {
      const { data, error } = await supabase.from('universities').insert(university).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['universities'] }),
  });
}

export function useUpdateUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'universities'> & { id: string }) => {
      const { data, error } = await supabase.from('universities').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['universities'] }),
  });
}

export function useDeleteUniversity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('universities').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['universities'] }),
  });
}

// Faculties
export function useFaculties() {
  return useQuery({
    queryKey: ['faculties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('faculties').select('*').order('name');
      if (error) throw error;
      return data as Faculty[];
    },
  });
}

export function useCreateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (faculty: TablesInsert<'faculties'>) => {
      const { data, error } = await supabase.from('faculties').insert(faculty).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['faculties'] }),
  });
}

export function useUpdateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'faculties'> & { id: string }) => {
      const { data, error } = await supabase.from('faculties').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['faculties'] }),
  });
}

export function useDeleteFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('faculties').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['faculties'] }),
  });
}

// Departments
export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('departments').select('*').order('name');
      if (error) throw error;
      return data as Department[];
    },
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (department: TablesInsert<'departments'>) => {
      const { data, error } = await supabase.from('departments').insert(department).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'departments'> & { id: string }) => {
      const { data, error } = await supabase.from('departments').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}

// Employees
export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase.from('employees').select('*').order('first_name');
      if (error) throw error;
      return data as Employee[];
    },
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (employee: TablesInsert<'employees'>) => {
      const { data, error } = await supabase.from('employees').insert(employee).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'employees'> & { id: string }) => {
      const { data, error } = await supabase.from('employees').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });
}

// Jobs
export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('jobs').select('*').order('title');
      if (error) throw error;
      return data as Job[];
    },
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (job: TablesInsert<'jobs'>) => {
      const { data, error } = await supabase.from('jobs').insert(job).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'jobs'> & { id: string }) => {
      const { data, error } = await supabase.from('jobs').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });
}

// Job Assignments
export function useJobAssignments() {
  return useQuery({
    queryKey: ['job_assignments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('job_assignments').select('*').order('start_date', { ascending: false });
      if (error) throw error;
      return data as JobAssignment[];
    },
  });
}

export function useCreateJobAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (assignment: TablesInsert<'job_assignments'>) => {
      const { data, error } = await supabase.from('job_assignments').insert(assignment).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['job_assignments'] }),
  });
}

export function useUpdateJobAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'job_assignments'> & { id: string }) => {
      const { data, error } = await supabase.from('job_assignments').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['job_assignments'] }),
  });
}

export function useDeleteJobAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('job_assignments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['job_assignments'] }),
  });
}

// Contracts
export function useContracts() {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contracts').select('*').order('start_date', { ascending: false });
      if (error) throw error;
      return data as Contract[];
    },
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contract: TablesInsert<'contracts'>) => {
      const { data, error } = await supabase.from('contracts').insert(contract).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contracts'] }),
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'contracts'> & { id: string }) => {
      const { data, error } = await supabase.from('contracts').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contracts'] }),
  });
}

export function useDeleteContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contracts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contracts'] }),
  });
}

// Training Programs
export function useTrainingPrograms() {
  return useQuery({
    queryKey: ['training_programs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('training_programs').select('*').order('start_date', { ascending: false });
      if (error) throw error;
      return data as TrainingProgram[];
    },
  });
}

export function useCreateTrainingProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (program: TablesInsert<'training_programs'>) => {
      const { data, error } = await supabase.from('training_programs').insert(program).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['training_programs'] }),
  });
}

export function useUpdateTrainingProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'training_programs'> & { id: string }) => {
      const { data, error } = await supabase.from('training_programs').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['training_programs'] }),
  });
}

export function useDeleteTrainingProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('training_programs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['training_programs'] }),
  });
}

// Performance Cycles
export function usePerformanceCycles() {
  return useQuery({
    queryKey: ['performance_cycles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('performance_cycles').select('*').order('start_date', { ascending: false });
      if (error) throw error;
      return data as PerformanceCycle[];
    },
  });
}

export function useCreatePerformanceCycle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cycle: TablesInsert<'performance_cycles'>) => {
      const { data, error } = await supabase.from('performance_cycles').insert(cycle).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['performance_cycles'] }),
  });
}

export function useUpdatePerformanceCycle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'performance_cycles'> & { id: string }) => {
      const { data, error } = await supabase.from('performance_cycles').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['performance_cycles'] }),
  });
}

export function useDeletePerformanceCycle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('performance_cycles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['performance_cycles'] }),
  });
}

// Appraisals
export function useAppraisals() {
  return useQuery({
    queryKey: ['appraisals'],
    queryFn: async () => {
      const { data, error } = await supabase.from('appraisals').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Appraisal[];
    },
  });
}

export function useCreateAppraisal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appraisal: TablesInsert<'appraisals'>) => {
      const { data, error } = await supabase.from('appraisals').insert(appraisal).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appraisals'] }),
  });
}

export function useUpdateAppraisal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'appraisals'> & { id: string }) => {
      const { data, error } = await supabase.from('appraisals').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appraisals'] }),
  });
}

export function useDeleteAppraisal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('appraisals').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appraisals'] }),
  });
}

// KPI Scores
export function useKPIScores() {
  return useQuery({
    queryKey: ['kpi_scores'],
    queryFn: async () => {
      const { data, error } = await supabase.from('kpi_scores').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as KPIScore[];
    },
  });
}

export function useCreateKPIScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (kpiScore: TablesInsert<'kpi_scores'>) => {
      const { data, error } = await supabase.from('kpi_scores').insert(kpiScore).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kpi_scores'] }),
  });
}

export function useUpdateKPIScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'kpi_scores'> & { id: string }) => {
      const { data, error } = await supabase.from('kpi_scores').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kpi_scores'] }),
  });
}

export function useDeleteKPIScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('kpi_scores').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kpi_scores'] }),
  });
}

// Dashboard Stats
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      const [
        { count: totalEmployees },
        { count: activeEmployees },
        { count: activeJobs },
        { count: trainingPrograms },
        { count: ongoingTraining },
        { count: completedTraining },
        { count: pendingAppraisals },
        { count: departments },
        { count: activeCycles },
        { data: appraisalsData },
      ] = await Promise.all([
        supabase.from('employees').select('*', { count: 'exact', head: true }),
        supabase.from('employees').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('training_programs').select('*', { count: 'exact', head: true }),
        supabase.from('training_programs').select('*', { count: 'exact', head: true }).eq('status', 'ongoing'),
        supabase.from('training_programs').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('appraisals').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('departments').select('*', { count: 'exact', head: true }),
        supabase.from('performance_cycles').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('appraisals').select('score'),
      ]);

      const avgPerformance = appraisalsData && appraisalsData.length > 0
        ? (appraisalsData.reduce((acc, a) => acc + (a.score || 0), 0) / appraisalsData.length).toFixed(1)
        : '0';

      return {
        totalEmployees: totalEmployees || 0,
        activeEmployees: activeEmployees || 0,
        activeJobs: activeJobs || 0,
        trainingPrograms: trainingPrograms || 0,
        ongoingTraining: ongoingTraining || 0,
        completedTraining: completedTraining || 0,
        pendingAppraisals: pendingAppraisals || 0,
        departments: departments || 0,
        activeCycles: activeCycles || 0,
        avgPerformance,
      };
    },
  });
}
