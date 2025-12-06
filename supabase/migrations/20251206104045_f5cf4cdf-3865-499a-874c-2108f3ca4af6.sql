-- Create enums for status types
CREATE TYPE job_level AS ENUM ('entry', 'mid', 'senior', 'lead', 'manager', 'director');
CREATE TYPE job_status AS ENUM ('open', 'closed', 'on-hold');
CREATE TYPE employee_status AS ENUM ('active', 'inactive', 'on-leave');
CREATE TYPE training_status AS ENUM ('upcoming', 'ongoing', 'completed');
CREATE TYPE cycle_status AS ENUM ('active', 'completed', 'draft');
CREATE TYPE appraisal_status AS ENUM ('pending', 'in-progress', 'completed');
CREATE TYPE contract_type AS ENUM ('permanent', 'temporary', 'contract', 'internship');
CREATE TYPE contract_status AS ENUM ('active', 'expired', 'terminated');
CREATE TYPE gender_type AS ENUM ('male', 'female');

-- Universities table
CREATE TABLE public.universities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Faculties table
CREATE TABLE public.faculties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  location TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  faculty_id UUID REFERENCES public.faculties(id) ON DELETE CASCADE,
  location TEXT,
  contact_email TEXT,
  manager_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  level job_level NOT NULL DEFAULT 'entry',
  min_salary NUMERIC(12,2),
  max_salary NUMERIC(12,2),
  status job_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status employee_status NOT NULL DEFAULT 'active',
  gender gender_type,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add manager_id foreign key to departments (after employees table exists)
ALTER TABLE public.departments 
ADD CONSTRAINT departments_manager_id_fkey 
FOREIGN KEY (manager_id) REFERENCES public.employees(id) ON DELETE SET NULL;

-- Job Assignments table
CREATE TABLE public.job_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  salary NUMERIC(12,2),
  status employee_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Training Programs table
CREATE TABLE public.training_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 20,
  enrolled INTEGER NOT NULL DEFAULT 0,
  status training_status NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance Cycles table
CREATE TABLE public.performance_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status cycle_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Appraisals table
CREATE TABLE public.appraisals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES public.performance_cycles(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  score NUMERIC(3,2),
  status appraisal_status NOT NULL DEFAULT 'pending',
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- KPI Scores table
CREATE TABLE public.kpi_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES public.performance_cycles(id) ON DELETE CASCADE,
  kpi_name TEXT NOT NULL,
  target NUMERIC(10,2) NOT NULL,
  achieved NUMERIC(10,2) NOT NULL DEFAULT 0,
  weight NUMERIC(5,2) NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contracts table
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  type contract_type NOT NULL DEFAULT 'permanent',
  start_date DATE NOT NULL,
  end_date DATE,
  salary NUMERIC(12,2) NOT NULL,
  status contract_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for all tables
CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON public.universities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faculties_updated_at BEFORE UPDATE ON public.faculties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_assignments_updated_at BEFORE UPDATE ON public.job_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_training_programs_updated_at BEFORE UPDATE ON public.training_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_performance_cycles_updated_at BEFORE UPDATE ON public.performance_cycles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appraisals_updated_at BEFORE UPDATE ON public.appraisals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kpi_scores_updated_at BEFORE UPDATE ON public.kpi_scores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appraisals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Create public read policies (internal HR system - all authenticated users can read)
CREATE POLICY "Allow public read access" ON public.universities FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.faculties FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.job_assignments FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.training_programs FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.performance_cycles FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.appraisals FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.kpi_scores FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.contracts FOR SELECT USING (true);

-- Create public write policies (for demo purposes - in production, restrict to authenticated users)
CREATE POLICY "Allow public insert" ON public.universities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.universities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.universities FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON public.faculties FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.faculties FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.faculties FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON public.departments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.departments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.departments FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON public.jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.jobs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.jobs FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON public.employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.employees FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.employees FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON public.job_assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.job_assignments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.job_assignments FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON public.training_programs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.training_programs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.training_programs FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON public.performance_cycles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.performance_cycles FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.performance_cycles FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON public.appraisals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.appraisals FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.appraisals FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON public.kpi_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.kpi_scores FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.kpi_scores FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON public.contracts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.contracts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.contracts FOR DELETE USING (true);