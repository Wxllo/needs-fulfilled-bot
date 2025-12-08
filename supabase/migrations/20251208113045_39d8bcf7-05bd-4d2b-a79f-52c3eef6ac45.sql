-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'hr_manager', 'employee');

-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on new tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin or hr_manager
CREATE OR REPLACE FUNCTION public.is_hr_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'hr_manager')
  )
$$;

-- Trigger to create profile and assign default role on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'employee');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for updating updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "HR staff can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_hr_staff(auth.uid()));

-- RLS Policies for user_roles (only admins can manage roles)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop old permissive policies and create proper ones for employees table
DROP POLICY IF EXISTS "Allow public read access " ON public.employees;
DROP POLICY IF EXISTS "Allow public insert " ON public.employees;
DROP POLICY IF EXISTS "Allow public update " ON public.employees;
DROP POLICY IF EXISTS "Allow public delete " ON public.employees;

CREATE POLICY "Authenticated users can view employees"
  ON public.employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "HR staff can insert employees"
  ON public.employees FOR INSERT
  TO authenticated
  WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can update employees"
  ON public.employees FOR UPDATE
  TO authenticated
  USING (public.is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can delete employees"
  ON public.employees FOR DELETE
  TO authenticated
  USING (public.is_hr_staff(auth.uid()));

-- Update contracts table policies
DROP POLICY IF EXISTS "Allow public read access " ON public.contracts;
DROP POLICY IF EXISTS "Allow public insert " ON public.contracts;
DROP POLICY IF EXISTS "Allow public update " ON public.contracts;
DROP POLICY IF EXISTS "Allow public delete " ON public.contracts;

CREATE POLICY "HR staff can view all contracts"
  ON public.contracts FOR SELECT
  TO authenticated
  USING (public.is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can manage contracts"
  ON public.contracts FOR ALL
  TO authenticated
  USING (public.is_hr_staff(auth.uid()));

-- Update appraisals table policies
DROP POLICY IF EXISTS "Allow public read access " ON public.appraisals;
DROP POLICY IF EXISTS "Allow public insert " ON public.appraisals;
DROP POLICY IF EXISTS "Allow public update " ON public.appraisals;
DROP POLICY IF EXISTS "Allow public delete " ON public.appraisals;

CREATE POLICY "HR staff can view all appraisals"
  ON public.appraisals FOR SELECT
  TO authenticated
  USING (public.is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can manage appraisals"
  ON public.appraisals FOR ALL
  TO authenticated
  USING (public.is_hr_staff(auth.uid()));

-- Update kpi_scores table policies
DROP POLICY IF EXISTS "Allow public read access " ON public.kpi_scores;
DROP POLICY IF EXISTS "Allow public insert " ON public.kpi_scores;
DROP POLICY IF EXISTS "Allow public update " ON public.kpi_scores;
DROP POLICY IF EXISTS "Allow public delete " ON public.kpi_scores;

CREATE POLICY "HR staff can view all kpi_scores"
  ON public.kpi_scores FOR SELECT
  TO authenticated
  USING (public.is_hr_staff(auth.uid()));

CREATE POLICY "HR staff can manage kpi_scores"
  ON public.kpi_scores FOR ALL
  TO authenticated
  USING (public.is_hr_staff(auth.uid()));

-- Update job_assignments table policies
DROP POLICY IF EXISTS "Allow public read access " ON public.job_assignments;
DROP POLICY IF EXISTS "Allow public insert " ON public.job_assignments;
DROP POLICY IF EXISTS "Allow public update " ON public.job_assignments;
DROP POLICY IF EXISTS "Allow public delete " ON public.job_assignments;

CREATE POLICY "Authenticated can view job_assignments"
  ON public.job_assignments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "HR staff can manage job_assignments"
  ON public.job_assignments FOR ALL
  TO authenticated
  USING (public.is_hr_staff(auth.uid()));

-- Update departments, faculties, universities, jobs, training_programs, performance_cycles
-- These are less sensitive - authenticated users can view, HR can manage

DROP POLICY IF EXISTS "Allow public read access " ON public.departments;
DROP POLICY IF EXISTS "Allow public insert " ON public.departments;
DROP POLICY IF EXISTS "Allow public update " ON public.departments;
DROP POLICY IF EXISTS "Allow public delete " ON public.departments;

CREATE POLICY "Authenticated can view departments"
  ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR staff can manage departments"
  ON public.departments FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid()));

DROP POLICY IF EXISTS "Allow public read access " ON public.faculties;
DROP POLICY IF EXISTS "Allow public insert " ON public.faculties;
DROP POLICY IF EXISTS "Allow public update " ON public.faculties;
DROP POLICY IF EXISTS "Allow public delete " ON public.faculties;

CREATE POLICY "Authenticated can view faculties"
  ON public.faculties FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR staff can manage faculties"
  ON public.faculties FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid()));

DROP POLICY IF EXISTS "Allow public read access " ON public.universities;
DROP POLICY IF EXISTS "Allow public insert " ON public.universities;
DROP POLICY IF EXISTS "Allow public update " ON public.universities;
DROP POLICY IF EXISTS "Allow public delete " ON public.universities;

CREATE POLICY "Authenticated can view universities"
  ON public.universities FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR staff can manage universities"
  ON public.universities FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid()));

DROP POLICY IF EXISTS "Allow public read access " ON public.jobs;
DROP POLICY IF EXISTS "Allow public insert " ON public.jobs;
DROP POLICY IF EXISTS "Allow public update " ON public.jobs;
DROP POLICY IF EXISTS "Allow public delete " ON public.jobs;

CREATE POLICY "Authenticated can view jobs"
  ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR staff can manage jobs"
  ON public.jobs FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid()));

DROP POLICY IF EXISTS "Allow public read access " ON public.training_programs;
DROP POLICY IF EXISTS "Allow public insert " ON public.training_programs;
DROP POLICY IF EXISTS "Allow public update " ON public.training_programs;
DROP POLICY IF EXISTS "Allow public delete " ON public.training_programs;

CREATE POLICY "Authenticated can view training_programs"
  ON public.training_programs FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR staff can manage training_programs"
  ON public.training_programs FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid()));

DROP POLICY IF EXISTS "Allow public read access " ON public.performance_cycles;
DROP POLICY IF EXISTS "Allow public insert " ON public.performance_cycles;
DROP POLICY IF EXISTS "Allow public update " ON public.performance_cycles;
DROP POLICY IF EXISTS "Allow public delete " ON public.performance_cycles;

CREATE POLICY "Authenticated can view performance_cycles"
  ON public.performance_cycles FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR staff can manage performance_cycles"
  ON public.performance_cycles FOR ALL TO authenticated USING (public.is_hr_staff(auth.uid()));