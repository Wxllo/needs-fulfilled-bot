import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const variantMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  Active: 'success',
  Completed: 'success',
  Ongoing: 'info',
  'In Progress': 'info',
  Pending: 'warning',
  Planning: 'warning',
  Probation: 'warning',
  Upcoming: 'info',
  Review: 'info',
  Leave: 'warning',
  Retired: 'default',
  Inactive: 'default',
  Terminated: 'danger',
};

const variantStyles = {
  default: 'bg-secondary text-secondary-foreground',
  success: 'bg-kpi-green/10 text-kpi-green',
  warning: 'bg-kpi-orange/10 text-kpi-orange',
  danger: 'bg-destructive/10 text-destructive',
  info: 'bg-kpi-blue/10 text-kpi-blue',
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const resolvedVariant = variant ?? variantMap[status] ?? 'default';
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[resolvedVariant]
      )}
    >
      {status}
    </span>
  );
}
