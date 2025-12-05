import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { employees, performanceCycles } from '@/data/mockData';

const mockKPIScores = [
  { id: '1', employeeId: '1', cycleId: '1', kpiName: 'Project Delivery', targetValue: 100, actualValue: 95, weight: 30, score: 4.75 },
  { id: '2', employeeId: '1', cycleId: '1', kpiName: 'Code Quality', targetValue: 100, actualValue: 88, weight: 25, score: 4.4 },
  { id: '3', employeeId: '1', cycleId: '1', kpiName: 'Team Collaboration', targetValue: 100, actualValue: 92, weight: 20, score: 4.6 },
  { id: '4', employeeId: '2', cycleId: '1', kpiName: 'Recruitment Goals', targetValue: 100, actualValue: 100, weight: 35, score: 5.0 },
  { id: '5', employeeId: '2', cycleId: '1', kpiName: 'Employee Satisfaction', targetValue: 100, actualValue: 85, weight: 30, score: 4.25 },
  { id: '6', employeeId: '3', cycleId: '1', kpiName: 'Report Accuracy', targetValue: 100, actualValue: 78, weight: 40, score: 3.9 },
];

export default function KPIScores() {
  const getEmployeeName = (id: string) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : '-';
  };

  const getCycleName = (id: string) => {
    return performanceCycles.find(c => c.id === id)?.name || '-';
  };

  const groupedByEmployee = mockKPIScores.reduce((acc, kpi) => {
    if (!acc[kpi.employeeId]) {
      acc[kpi.employeeId] = [];
    }
    acc[kpi.employeeId].push(kpi);
    return acc;
  }, {} as Record<string, typeof mockKPIScores>);

  return (
    <MainLayout>
      <PageHeader
        title="KPI Scores"
        description="View employee KPI performance scores"
      />

      <div className="space-y-6">
        {Object.entries(groupedByEmployee).map(([employeeId, kpis]) => (
          <Card key={employeeId} className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{getEmployeeName(employeeId)}</h3>
                <p className="text-sm text-muted-foreground">{getCycleName(kpis[0].cycleId)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <p className="text-2xl font-bold text-kpi-blue">
                  {(kpis.reduce((sum, k) => sum + k.score * k.weight, 0) / kpis.reduce((sum, k) => sum + k.weight, 0)).toFixed(2)}/5
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {kpis.map((kpi) => (
                <div key={kpi.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{kpi.kpiName}</span>
                    <span className="text-sm text-muted-foreground">
                      {kpi.actualValue}/{kpi.targetValue} ({kpi.weight}% weight)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={(kpi.actualValue / kpi.targetValue) * 100} 
                      className="flex-1 h-2"
                    />
                    <span className="text-sm font-semibold text-kpi-green w-12 text-right">
                      {kpi.score}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
