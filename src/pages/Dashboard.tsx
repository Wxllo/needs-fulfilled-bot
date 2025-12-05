import { MainLayout } from '@/components/layout/MainLayout';
import { KPICard } from '@/components/ui/kpi-card';
import { getDashboardStats } from '@/data/mockData';
import { Users, Briefcase, BookOpen, Building, Award, TrendingUp, Target } from 'lucide-react';

export default function Dashboard() {
  const stats = getDashboardStats();

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
            change="+12% from last month"
            changeType="positive"
            icon={Users}
            variant="blue"
          />
          <KPICard
            title="Active Jobs"
            value={stats.activeJobs}
            subtitle="Open positions"
            change="+3 new this week"
            changeType="positive"
            icon={Briefcase}
            variant="green"
          />
          <KPICard
            title="Training Programs"
            value={stats.trainingPrograms}
            subtitle="Ongoing programs"
            change={`${stats.completedTraining} completed this month`}
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
            change="Q4 cycle active"
            changeType="neutral"
            icon={Award}
            variant="purple"
          />
          <KPICard
            title="Departments"
            value={stats.departments}
            subtitle="Across 3 faculties"
            change="2 new departments"
            changeType="positive"
            icon={Building}
            variant="teal"
          />
          <KPICard
            title="Avg. Performance"
            value={`${stats.avgPerformance}/5`}
            subtitle="Overall score"
            change="+0.3 improvement"
            changeType="positive"
            icon={TrendingUp}
            variant="green"
          />
          <KPICard
            title="Performance Cycles"
            value={stats.activeCycles}
            subtitle="Active cycles"
            change="Review deadline soon"
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
              <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                <div className="h-2 w-2 rounded-full bg-kpi-green" />
                <p className="text-sm">New employee onboarded - Mohamed Khaled</p>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                <div className="h-2 w-2 rounded-full bg-kpi-blue" />
                <p className="text-sm">Q4 Performance cycle started</p>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                <div className="h-2 w-2 rounded-full bg-kpi-orange" />
                <p className="text-sm">Agile training program ongoing</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">Upcoming Deadlines</h3>
            <p className="mt-1 text-sm text-muted-foreground">Important dates to remember</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <p className="text-sm">Q4 Review submissions</p>
                <span className="text-xs font-medium text-kpi-orange">Dec 31, 2024</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <p className="text-sm">Data Analytics training ends</p>
                <span className="text-xs font-medium text-kpi-blue">Sep 30, 2024</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <p className="text-sm">Annual review completion</p>
                <span className="text-xs font-medium text-kpi-purple">Dec 31, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
