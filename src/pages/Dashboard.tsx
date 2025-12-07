import { MainLayout } from '@/components/layout/MainLayout';
import { KPICard } from '@/components/ui/kpi-card';
import { useDashboardStats, useEmployees, useTrainingPrograms } from '@/hooks/useSupabaseData';
import { Users, Briefcase, BookOpen, Building, Award, TrendingUp, Target } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: employees = [] } = useEmployees();
  const { data: programs = [] } = useTrainingPrograms();

  if (isLoading || !stats) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </MainLayout>
    );
  }

  const recentEmployee = employees[employees.length - 1];
  const ongoingProgram = programs.find(p => p.status === 'ongoing');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome to your HR Management System. Here's an overview of your organization.
          </p>
        </div>

        {/* Organization Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <KPICard
            title="Total Employees"
            value={stats.totalEmployees.toLocaleString()}
            subtitle="Active employees"
            change={`${stats.activeEmployees} active`}
            changeType="positive"
            icon={Users}
            variant="blue"
          />
          <KPICard
            title="Active Jobs"
            value={stats.activeJobs}
            subtitle="Open positions"
            change="Available for hiring"
            changeType="positive"
            icon={Briefcase}
            variant="green"
          />
          <KPICard
            title="Training Programs"
            value={stats.trainingPrograms}
            subtitle="Total programs"
            change={`${stats.completedTraining} completed`}
            changeType="neutral"
            icon={BookOpen}
            variant="orange"
          />
        </div>

        {/* HR Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Appraisals"
            value={stats.pendingAppraisals}
            subtitle="Pending reviews"
            change="Awaiting completion"
            changeType="neutral"
            icon={Award}
            variant="purple"
          />
          <KPICard
            title="Departments"
            value={stats.departments}
            subtitle="Active departments"
            change="Across all faculties"
            changeType="positive"
            icon={Building}
            variant="teal"
          />
          <KPICard
            title="Avg. Performance"
            value={`${stats.avgPerformance}/5`}
            subtitle="Overall score"
            change="Based on appraisals"
            changeType="positive"
            icon={TrendingUp}
            variant="green"
          />
          <KPICard
            title="Performance Cycles"
            value={stats.activeCycles}
            subtitle="Active cycles"
            change="In progress"
            changeType="neutral"
            icon={Target}
            variant="blue"
          />
        </div>

        {/* Quick Info Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
            <p className="mt-1 text-sm text-muted-foreground">Latest updates in your organization</p>
            <div className="mt-4 space-y-3">
              {recentEmployee && (
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                  <div className="h-2 w-2 rounded-full bg-kpi-green" />
                  <p className="text-sm">New employee - {recentEmployee.first_name} {recentEmployee.last_name}</p>
                </div>
              )}
              {stats.activeCycles > 0 && (
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                  <div className="h-2 w-2 rounded-full bg-kpi-blue" />
                  <p className="text-sm">{stats.activeCycles} performance cycle(s) active</p>
                </div>
              )}
              {ongoingProgram && (
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                  <div className="h-2 w-2 rounded-full bg-kpi-orange" />
                  <p className="text-sm">{ongoingProgram.name} - ongoing training</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">Quick Stats</h3>
            <p className="mt-1 text-sm text-muted-foreground">Key metrics at a glance</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <p className="text-sm">Ongoing Training Programs</p>
                <span className="text-xs font-medium text-kpi-orange">{stats.ongoingTraining}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <p className="text-sm">Pending Appraisals</p>
                <span className="text-xs font-medium text-kpi-blue">{stats.pendingAppraisals}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <p className="text-sm">Completed Training</p>
                <span className="text-xs font-medium text-kpi-green">{stats.completedTraining}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
