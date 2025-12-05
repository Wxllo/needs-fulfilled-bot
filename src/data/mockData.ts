import { 
  Employee, Department, Faculty, University, Job, 
  JobAssignment, TrainingProgram, PerformanceCycle, Appraisal 
} from '@/types/hrms';

export const universities: University[] = [
  { id: '1', name: 'National University of Technology', location: 'Cairo, Egypt', contactEmail: 'info@nut.edu' },
  { id: '2', name: 'German International University', location: 'New Cairo, Egypt', contactEmail: 'info@giu.edu' },
];

export const faculties: Faculty[] = [
  { id: '1', name: 'Faculty of Engineering', universityId: '1', location: 'Main Campus, Building A', contactEmail: 'engineering@nut.edu' },
  { id: '2', name: 'Faculty of Business', universityId: '1', location: 'Main Campus, Building B', contactEmail: 'business@nut.edu' },
  { id: '3', name: 'Faculty of Computer Science', universityId: '2', location: 'GIU Campus, Block C', contactEmail: 'cs@giu.edu' },
];

export const departments: Department[] = [
  { id: '1', name: 'Software Development', facultyId: '3', location: 'Block C, Floor 2', contactEmail: 'softdev@giu.edu', managerId: '1' },
  { id: '2', name: 'Human Resources', facultyId: '2', location: 'Building B, Floor 1', contactEmail: 'hr@nut.edu', managerId: '2' },
  { id: '3', name: 'Finance', facultyId: '2', location: 'Building B, Floor 3', contactEmail: 'finance@nut.edu', managerId: '3' },
  { id: '4', name: 'Mechanical Engineering', facultyId: '1', location: 'Building A, Floor 1', contactEmail: 'mech@nut.edu', managerId: '4' },
];

export const jobs: Job[] = [
  { id: '1', title: 'Software Engineer', description: 'Develop and maintain software applications', level: 'Mid', minSalary: 8000, maxSalary: 15000, status: 'Active', category: 'Engineering' },
  { id: '2', title: 'HR Manager', description: 'Manage HR operations and employee relations', level: 'Manager', minSalary: 12000, maxSalary: 20000, status: 'Active', category: 'Human Resources' },
  { id: '3', title: 'Financial Analyst', description: 'Analyze financial data and prepare reports', level: 'Junior', minSalary: 6000, maxSalary: 10000, status: 'Active', category: 'Finance' },
  { id: '4', title: 'Senior Developer', description: 'Lead development projects and mentor juniors', level: 'Senior', minSalary: 15000, maxSalary: 25000, status: 'Active', category: 'Engineering' },
  { id: '5', title: 'Project Manager', description: 'Manage project timelines and deliverables', level: 'Manager', minSalary: 14000, maxSalary: 22000, status: 'Active', category: 'Management' },
];

export const employees: Employee[] = [
  { id: '1', firstName: 'Ahmed', lastName: 'Hassan', email: 'ahmed.hassan@company.com', phone: '+20 100 123 4567', departmentId: '1', jobId: '4', hireDate: '2020-03-15', status: 'Active', gender: 'Male', dateOfBirth: '1988-05-20' },
  { id: '2', firstName: 'Sara', lastName: 'Mohamed', email: 'sara.mohamed@company.com', phone: '+20 100 234 5678', departmentId: '2', jobId: '2', hireDate: '2019-06-01', status: 'Active', gender: 'Female', dateOfBirth: '1990-08-12' },
  { id: '3', firstName: 'Omar', lastName: 'Ali', email: 'omar.ali@company.com', phone: '+20 100 345 6789', departmentId: '3', jobId: '3', hireDate: '2021-01-10', status: 'Probation', gender: 'Male', dateOfBirth: '1995-02-28' },
  { id: '4', firstName: 'Fatma', lastName: 'Ibrahim', email: 'fatma.ibrahim@company.com', phone: '+20 100 456 7890', departmentId: '4', jobId: '5', hireDate: '2018-09-20', status: 'Active', gender: 'Female', dateOfBirth: '1985-11-15' },
  { id: '5', firstName: 'Mohamed', lastName: 'Khaled', email: 'mohamed.khaled@company.com', phone: '+20 100 567 8901', departmentId: '1', jobId: '1', hireDate: '2022-04-05', status: 'Active', gender: 'Male', dateOfBirth: '1992-07-03' },
  { id: '6', firstName: 'Nour', lastName: 'Ahmed', email: 'nour.ahmed@company.com', phone: '+20 100 678 9012', departmentId: '1', jobId: '1', hireDate: '2023-02-14', status: 'Probation', gender: 'Female', dateOfBirth: '1998-04-22' },
];

export const jobAssignments: JobAssignment[] = [
  { id: '1', employeeId: '1', jobId: '4', departmentId: '1', startDate: '2020-03-15', status: 'Active', salary: 18000 },
  { id: '2', employeeId: '2', jobId: '2', departmentId: '2', startDate: '2019-06-01', status: 'Active', salary: 16000 },
  { id: '3', employeeId: '3', jobId: '3', departmentId: '3', startDate: '2021-01-10', status: 'Active', salary: 7500 },
  { id: '4', employeeId: '4', jobId: '5', departmentId: '4', startDate: '2018-09-20', status: 'Active', salary: 19000 },
  { id: '5', employeeId: '5', jobId: '1', departmentId: '1', startDate: '2022-04-05', status: 'Active', salary: 12000 },
];

export const trainingPrograms: TrainingProgram[] = [
  { id: '1', name: 'Leadership Development', description: 'Develop leadership skills for managers', startDate: '2024-01-15', endDate: '2024-03-15', status: 'Completed', capacity: 20, enrolledCount: 18 },
  { id: '2', name: 'Agile Methodology', description: 'Learn agile project management', startDate: '2024-06-01', endDate: '2024-07-01', status: 'Ongoing', capacity: 30, enrolledCount: 25 },
  { id: '3', name: 'Data Analytics Fundamentals', description: 'Introduction to data analysis', startDate: '2024-08-01', endDate: '2024-09-30', status: 'Upcoming', capacity: 25, enrolledCount: 12 },
  { id: '4', name: 'Communication Skills', description: 'Improve workplace communication', startDate: '2024-02-01', endDate: '2024-02-28', status: 'Completed', capacity: 40, enrolledCount: 38 },
];

export const performanceCycles: PerformanceCycle[] = [
  { id: '1', name: 'Q4 2024 Review', startDate: '2024-10-01', endDate: '2024-12-31', status: 'Active', description: 'Fourth quarter performance review cycle' },
  { id: '2', name: 'Q3 2024 Review', startDate: '2024-07-01', endDate: '2024-09-30', status: 'Completed', description: 'Third quarter performance review cycle' },
  { id: '3', name: 'Annual 2024 Review', startDate: '2024-01-01', endDate: '2024-12-31', status: 'Active', description: 'Annual performance review for 2024' },
];

export const appraisals: Appraisal[] = [
  { id: '1', employeeId: '1', cycleId: '1', reviewerId: '2', score: 4.5, comments: 'Excellent performance', status: 'Completed', createdAt: '2024-11-15' },
  { id: '2', employeeId: '2', cycleId: '1', reviewerId: '4', score: 4.2, comments: 'Good leadership', status: 'Completed', createdAt: '2024-11-16' },
  { id: '3', employeeId: '3', cycleId: '1', reviewerId: '2', score: 3.8, comments: 'Meeting expectations', status: 'In Progress', createdAt: '2024-11-18' },
  { id: '4', employeeId: '5', cycleId: '1', reviewerId: '1', score: 4.0, comments: 'Strong technical skills', status: 'Pending', createdAt: '2024-11-20' },
];

export const getDashboardStats = () => ({
  totalEmployees: employees.length,
  activeEmployees: employees.filter(e => e.status === 'Active').length,
  activeJobs: jobs.filter(j => j.status === 'Active').length,
  trainingPrograms: trainingPrograms.length,
  ongoingTraining: trainingPrograms.filter(t => t.status === 'Ongoing').length,
  completedTraining: trainingPrograms.filter(t => t.status === 'Completed').length,
  pendingAppraisals: appraisals.filter(a => a.status === 'Pending').length,
  departments: departments.length,
  avgPerformance: (appraisals.reduce((acc, a) => acc + a.score, 0) / appraisals.length).toFixed(1),
  activeCycles: performanceCycles.filter(c => c.status === 'Active').length,
});
