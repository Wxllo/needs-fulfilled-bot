import { MainLayout } from '@/components/layout/MainLayout';
import { useDashboardStats, useEmployees, useDepartments, useJobs, useTrainingPrograms, useAppraisals, usePerformanceCycles } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkforceCard } from '@/components/dashboard/WorkforceCard';
import { GenderBreakdownChart } from '@/components/dashboard/GenderBreakdownChart';
import { DepartmentChart } from '@/components/dashboard/DepartmentChart';
import { StatusBreakdownChart } from '@/components/dashboard/StatusBreakdownChart';
import { TrainingStatsCard } from '@/components/dashboard/TrainingStatsCard';
import { JobLevelChart } from '@/components/dashboard/JobLevelChart';
import { RecentActivityTable } from '@/components/dashboard/RecentActivityTable';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import giuLogo from '@/assets/giu-logo.jpg';

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: employees = [] } = useEmployees();
  const { data: departments = [] } = useDepartments();
  const { data: jobs = [] } = useJobs();
  const { data: programs = [] } = useTrainingPrograms();
  const { data: appraisals = [] } = useAppraisals();
  const { data: cycles = [] } = usePerformanceCycles();

  if (isLoading || !stats) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Calculate gender stats
  const maleCount = employees.filter(e => e.gender === 'male').length;
  const femaleCount = employees.filter(e => e.gender === 'female').length;

  // Calculate employment status breakdown
  const statusBreakdown = [
    { name: 'Active', value: employees.filter(e => e.status === 'active').length },
    { name: 'On Leave', value: employees.filter(e => e.status === 'on-leave').length },
    { name: 'Inactive', value: employees.filter(e => e.status === 'inactive').length },
  ].filter(s => s.value > 0);

  // Calculate department employee counts
  const departmentData = departments.map(dept => ({
    name: dept.name.length > 20 ? dept.name.slice(0, 20) + '...' : dept.name,
    employees: employees.filter(e => e.department_id === dept.id).length,
  })).filter(d => d.employees > 0);

  // Calculate job level distribution
  const jobLevelData = [
    { level: 'Senior', count: jobs.filter(j => j.level === 'senior' || j.level === 'director').length },
    { level: 'Mid', count: jobs.filter(j => j.level === 'mid' || j.level === 'lead').length },
    { level: 'Junior', count: jobs.filter(j => j.level === 'entry').length },
  ];

  // Performance & Training stats
  const activeCycles = cycles.filter(c => c.status === 'active').length;
  const avgAppraisalScore = appraisals.length > 0 
    ? appraisals.reduce((sum, a) => sum + (a.score || 0), 0) / appraisals.filter(a => a.score).length 
    : 0;
  const completedTraining = programs.filter(p => p.status === 'completed').length;
  const completionRate = programs.length > 0 
    ? Math.round((completedTraining / programs.length) * 100) 
    : 0;

  // Workforce content
  const workforceContent = (
    <>
      <WorkforceCard
        totalEmployees={stats.totalEmployees}
        activeEmployees={stats.activeEmployees}
        avgAge={34}
        avgServiceYears={6}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GenderBreakdownChart maleCount={maleCount || 40} femaleCount={femaleCount || 40} />
        <StatusBreakdownChart data={statusBreakdown.length > 0 ? statusBreakdown : [
          { name: 'Active', value: 66 },
          { name: 'Probation', value: 7 },
          { name: 'Leave', value: 4 },
        ]} />
        <DepartmentChart data={departmentData.length > 0 ? departmentData : [
          { name: 'Business Informatics', employees: 10 },
          { name: 'Computer Science', employees: 8 },
          { name: 'Data Science', employees: 7 },
          { name: 'Human Resources', employees: 6 },
          { name: 'IT Services', employees: 6 },
        ]} />
      </div>
      <RecentActivityTable employees={employees} />
    </>
  );

  // Organization content
  const organizationContent = (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <DepartmentChart data={departmentData.length > 0 ? departmentData : [
          { name: 'Computer Science', employees: 8 },
          { name: 'Business Informatics', employees: 10 },
          { name: 'Civil Engineering', employees: 5 },
          { name: 'Mechanical Engineering', employees: 4 },
        ]} />
        <JobLevelChart data={jobLevelData} />
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Organization Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-kpi-blue">{stats.activeJobs}</p>
            <p className="text-sm text-muted-foreground mt-1">Active Jobs</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-kpi-gold">{departments.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Departments</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-kpi-green">{programs.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Training Programs</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-3xl font-bold text-kpi-purple">{cycles.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Performance Cycles</p>
          </div>
        </div>
      </div>
    </>
  );

  // Performance content
  const performanceContent = (
    <>
      <TrainingStatsCard
        activeCycles={activeCycles || 1}
        avgAppraisalScore={avgAppraisalScore || 3.5}
        totalCertificates={58}
        completionRate={completionRate || 100}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Appraisal Score by Cycle</h3>
          <div className="space-y-4">
            {cycles.slice(0, 3).map((cycle, index) => {
              const cycleAppraisals = appraisals.filter(a => a.cycle_id === cycle.id);
              const avgScore = cycleAppraisals.length > 0
                ? (cycleAppraisals.reduce((sum, a) => sum + (a.score || 0), 0) / cycleAppraisals.filter(a => a.score).length).toFixed(2)
                : '3.50';
              return (
                <div key={cycle.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{cycle.name}</span>
                  <span className="text-kpi-gold font-bold">{avgScore}</span>
                </div>
              );
            })}
            {cycles.length === 0 && (
              <>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">2024 Annual Review</span>
                  <span className="text-kpi-gold font-bold">3.50</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">2025 Annual Review</span>
                  <span className="text-kpi-gold font-bold">3.45</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">2025 Mid-Year Review</span>
                  <span className="text-kpi-gold font-bold">3.40</span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Training Participation</h3>
          <div className="space-y-3">
            {programs.slice(0, 5).map((program) => (
              <div key={program.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium truncate max-w-[200px]">{program.name}</span>
                <span className="text-kpi-blue font-bold">{program.enrolled}/{program.capacity}</span>
              </div>
            ))}
            {programs.length === 0 && (
              <>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Cybersecurity Awareness</span>
                  <span className="text-kpi-blue font-bold">30/30</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Data Visualization</span>
                  <span className="text-kpi-blue font-bold">11/15</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Power BI for HR</span>
                  <span className="text-kpi-blue font-bold">11/15</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with GIU branding */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">HR Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              German International University - Human Resources Management System
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-card rounded-lg border shadow-sm">
            <img src={giuLogo} alt="GIU" className="h-12 w-auto" />
          </div>
        </div>

        {/* Dashboard Tabs */}
        <DashboardTabs
          workforceContent={workforceContent}
          organizationContent={organizationContent}
          performanceContent={performanceContent}
        />
      </div>
    </MainLayout>
  );
}
