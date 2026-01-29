import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  hire_date: string;
}

interface RecentActivityTableProps {
  employees: Employee[];
}

export function RecentActivityTable({ employees }: RecentActivityTableProps) {
  const recentEmployees = employees.slice(0, 8);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-kpi-green/10 text-kpi-green border-kpi-green/30';
      case 'inactive':
        return 'bg-muted text-muted-foreground border-muted';
      case 'on-leave':
        return 'bg-kpi-gold/10 text-kpi-gold border-kpi-gold/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-foreground">Employee Directory</h3>
        <p className="text-sm text-muted-foreground mt-1">Recent employee records</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hire Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentEmployees.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {employee.first_name} {employee.last_name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {employee.email}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn('capitalize', getStatusColor(employee.status))}
                  >
                    {employee.status.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(employee.hire_date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
