import { BookOpen, Award, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrainingStatsCardProps {
  activeCycles: number;
  avgAppraisalScore: number;
  totalCertificates: number;
  completionRate: number;
}

export function TrainingStatsCard({
  activeCycles,
  avgAppraisalScore,
  totalCertificates,
  completionRate,
}: TrainingStatsCardProps) {
  const stats = [
    {
      label: 'Active Perf Cycles',
      value: activeCycles,
      icon: Target,
      color: 'text-kpi-blue',
      bgColor: 'bg-kpi-blue/10',
    },
    {
      label: 'Avg Appraisal Score',
      value: avgAppraisalScore.toFixed(1),
      icon: TrendingUp,
      color: 'text-kpi-green',
      bgColor: 'bg-kpi-green/10',
    },
    {
      label: 'Total Certificates Issued',
      value: totalCertificates,
      icon: Award,
      color: 'text-kpi-gold',
      bgColor: 'bg-kpi-gold/10',
    },
    {
      label: 'Training Completion Rate',
      value: `${completionRate}%`,
      icon: BookOpen,
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
            <p className={cn('text-3xl font-bold', stat.color)}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
