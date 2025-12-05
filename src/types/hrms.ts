export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  jobId: string;
  hireDate: string;
  status: 'Active' | 'Probation' | 'Leave' | 'Retired';
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
}

export interface Department {
  id: string;
  name: string;
  facultyId: string;
  managerId?: string;
  location: string;
  contactEmail: string;
}

export interface Faculty {
  id: string;
  name: string;
  universityId: string;
  location: string;
  contactEmail: string;
}

export interface University {
  id: string;
  name: string;
  location: string;
  contactEmail: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  level: 'Entry' | 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Manager' | 'Director';
  minSalary: number;
  maxSalary: number;
  status: 'Active' | 'Inactive';
  category: string;
}

export interface JobAssignment {
  id: string;
  employeeId: string;
  jobId: string;
  departmentId: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Completed' | 'Terminated';
  salary: number;
}

export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  capacity: number;
  enrolledCount: number;
}

export interface PerformanceCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Planning' | 'Active' | 'Review' | 'Completed';
  description: string;
}

export interface Appraisal {
  id: string;
  employeeId: string;
  cycleId: string;
  reviewerId: string;
  score: number;
  comments: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
}

export interface KPIScore {
  id: string;
  employeeId: string;
  cycleId: string;
  kpiName: string;
  targetValue: number;
  actualValue: number;
  weight: number;
  score: number;
}
