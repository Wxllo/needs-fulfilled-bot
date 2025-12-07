import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useKPIScores, useEmployees, usePerformanceCycles } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';

export default function KPIScores() {
  const { data: kpiScores = [], isLoading: kpiLoading } = useKPIScores();
  const { data: employees = [] } = useEmployees();
  const { data: cycles = [] } = usePerformanceCycles();

  const getEmployeeName = (id: string) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.first_name} ${emp.last_name}` : '-';
  };

  const getCycleName = (id: string) => {
    return cycles.find(c => c.id === id)?.name || '-';
  };

  const groupedByEmployee = kpiScores.reduce((acc, kpi) => {
    if (!acc[kpi.employee_id]) {
      acc[kpi.employee_id] = [];
    }
    acc[kpi.employee_id].push(kpi);
    return acc;
  }, {} as Record<string, typeof kpiScores>);

  if (kpiLoading) {
    return (
      <MainLayout>
        <PageHeader title="KPI Scores" description="View employee KPI performance scores" />
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (kpiScores.length === 0) {
    return (
      <MainLayout>
        <PageHeader title="KPI Scores" description="View employee KPI performance scores" />
        <Card className="p-6">
          <p className="text-center text-muted-foreground">No KPI scores found.</p>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="KPI Scores"
        description="View employee KPI performance scores"
      />

      <div className="space-y-6">
        {Object.entries(groupedByEmployee).map(([employeeId, kpis]) => {
          const totalWeight = kpis.reduce((sum, k) => sum + k.weight, 0);
          const weightedScore = totalWeight > 0 
            ? kpis.reduce((sum, k) => sum + ((k.achieved / k.target) * 5 * k.weight), 0) / totalWeight
            : 0;

          return (
            <Card key={employeeId} className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{getEmployeeName(employeeId)}</h3>
                  <p className="text-sm text-muted-foreground">{getCycleName(kpis[0].cycle_id)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                  <p className="text-2xl font-bold text-kpi-blue">
                    {weightedScore.toFixed(2)}/5
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {kpis.map((kpi) => {
                  const percentage = kpi.target > 0 ? (kpi.achieved / kpi.target) * 100 : 0;
                  const score = (percentage / 100) * 5;
                  
                  return (
                    <div key={kpi.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{kpi.kpi_name}</span>
                        <span className="text-sm text-muted-foreground">
                          {kpi.achieved}/{kpi.target} ({kpi.weight}% weight)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className="flex-1 h-2"
                        />
                        <span className="text-sm font-semibold text-kpi-green w-12 text-right">
                          {score.toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </MainLayout>
  );
}
