import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  variant?: 'default' | 'blue' | 'green' | 'orange' | 'purple' | 'teal';
}

const variantStyles = {
  default: 'bg-card border-border',
  blue: 'bg-card border-kpi-blue/20',
  green: 'bg-card border-kpi-green/20',
  orange: 'bg-card border-kpi-orange/20',
  purple: 'bg-card border-kpi-purple/20',
  teal: 'bg-card border-kpi-teal/20',
};

const iconStyles = {
  default: 'text-muted-foreground',
  blue: 'text-kpi-blue',
  green: 'text-kpi-green',
  orange: 'text-kpi-orange',
  purple: 'text-kpi-purple',
  teal: 'text-kpi-teal',
};

const valueStyles = {
  default: 'text-foreground',
  blue: 'text-kpi-blue',
  green: 'text-kpi-green',
  orange: 'text-kpi-orange',
  purple: 'text-kpi-purple',
  teal: 'text-kpi-teal',
};

export function KPICard({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon: Icon,
  variant = 'default',
}: KPICardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md animate-fade-in',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn('text-3xl font-bold', valueStyles[variant])}>{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {change && (
            <p
              className={cn(
                'text-sm font-medium',
                changeType === 'positive' && 'text-kpi-green',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('rounded-lg bg-secondary p-3', iconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}
