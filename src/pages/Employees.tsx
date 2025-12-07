import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee, useDepartments, useJobs, Employee } from '@/hooks/useSupabaseData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from '@/integrations/supabase/types';

type EmployeeStatus = Database['public']['Enums']['employee_status'];
type GenderType = Database['public']['Enums']['gender_type'];

export default function Employees() {
  const { data: employees = [], isLoading } = useEmployees();
  const { data: departments = [] } = useDepartments();
  const { data: jobs = [] } = useJobs();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    job_id: '',
    hire_date: '',
    status: 'active' as EmployeeStatus,
    gender: 'male' as GenderType,
  });

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (emp) => `${emp.first_name} ${emp.last_name}`,
    },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'department_id',
      header: 'Department',
      render: (emp) => departments.find((d) => d.id === emp.department_id)?.name || '-',
    },
    {
      key: 'job_id',
      header: 'Job',
      render: (emp) => jobs.find((j) => j.id === emp.job_id)?.title || '-',
    },
    { key: 'hire_date', header: 'Hire Date' },
    {
      key: 'status',
      header: 'Status',
      render: (emp) => <StatusBadge status={emp.status} />,
    },
  ];

  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      department_id: '',
      job_id: '',
      hire_date: new Date().toISOString().split('T')[0],
      status: 'active',
      gender: 'male',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone: employee.phone || '',
      department_id: employee.department_id || '',
      job_id: employee.job_id || '',
      hire_date: employee.hire_date,
      status: employee.status,
      gender: employee.gender || 'male',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (employee: Employee) => {
    try {
      await deleteEmployee.mutateAsync(employee.id);
      toast({ title: 'Employee deleted', description: `${employee.first_name} ${employee.last_name} has been removed.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete employee.', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        department_id: formData.department_id || null,
        job_id: formData.job_id || null,
        hire_date: formData.hire_date,
        status: formData.status,
        gender: formData.gender,
      };
      if (editingEmployee) {
        await updateEmployee.mutateAsync({ id: editingEmployee.id, ...dataToSave });
        toast({ title: 'Employee updated', description: 'Employee details have been updated.' });
      } else {
        await createEmployee.mutateAsync(dataToSave);
        toast({ title: 'Employee added', description: 'New employee has been added.' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save employee.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageHeader title="Employees" description="Manage employee information" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Employees"
        description="Manage employee information"
        actionLabel="Add Employee"
        onAction={handleAdd}
      />

      <DataTable
        data={employees}
        columns={columns}
        searchKey="first_name"
        searchPlaceholder="Search employees..."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department_id} onValueChange={(v) => setFormData({ ...formData, department_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job">Job</Label>
                <Select value={formData.job_id} onValueChange={(v) => setFormData({ ...formData, job_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hire_date">Hire Date</Label>
                <Input
                  id="hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as EmployeeStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v as GenderType })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {editingEmployee ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
