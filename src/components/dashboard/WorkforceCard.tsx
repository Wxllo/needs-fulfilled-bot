import { Users, UserCheck, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkforceCardProps {
  totalEmployees: number;
  activeEmployees: number;
  avgAge: number;
  avgServiceYears: number;
}

export function WorkforceCard({ 
  totalEmployees, 
  activeEmployees, 
  avgAge, 
  avgServiceYears 
}: WorkforceCardProps) {
  const stats = [
    {
      label: 'Total Employees',
      value: totalEmployees,
      icon: Users,
      color: 'text-kpi-blue',
      bgColor: 'bg-kpi-blue/10',
    },
    {
      label: 'Active Employees',
      value: activeEmployees,
      icon: UserCheck,
      color: 'text-kpi-green',
      bgColor: 'bg-kpi-green/10',
    },
    {
      label: 'Avg Employee Age',
      value: avgAge,
      icon: Calendar,
      color: 'text-kpi-orange',
      bgColor: 'bg-kpi-orange/10',
    },
    {
      label: 'Average Service Yrs',
      value: avgServiceYears,
      icon: Clock,
      color: 'text-kpi-purple',
      bgColor: 'bg-kpi-purple/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className={cn('absolute top-3 right-3 p-2 rounded-lg', stat.bgColor)}>
            <stat.icon className={cn('h-5 w-5', stat.color)} />
          </div>
          <div className="space-y-1">
            <p className={cn('text-4xl font-bold', stat.color)}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
