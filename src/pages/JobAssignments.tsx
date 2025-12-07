import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { useJobAssignments, useCreateJobAssignment, useUpdateJobAssignment, useDeleteJobAssignment, useEmployees, useJobs, useDepartments, JobAssignment } from '@/hooks/useSupabaseData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from '@/integrations/supabase/types';

type EmployeeStatus = Database['public']['Enums']['employee_status'];

export default function JobAssignments() {
  const { data: assignments = [], isLoading } = useJobAssignments();
  const { data: employees = [] } = useEmployees();
  const { data: jobs = [] } = useJobs();
  const { data: departments = [] } = useDepartments();
  const createAssignment = useCreateJobAssignment();
  const updateAssignment = useUpdateJobAssignment();
  const deleteAssignment = useDeleteJobAssignment();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<JobAssignment | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    employee_id: '',
    job_id: '',
    department_id: '',
    start_date: '',
    end_date: '',
    status: 'active' as EmployeeStatus,
    salary: 0,
  });

  const columns: Column<JobAssignment>[] = [
    {
      key: 'employee_id',
      header: 'Employee',
      render: (a) => {
        const emp = employees.find((e) => e.id === a.employee_id);
        return emp ? `${emp.first_name} ${emp.last_name}` : '-';
      },
    },
    {
      key: 'job_id',
      header: 'Job',
      render: (a) => jobs.find((j) => j.id === a.job_id)?.title || '-',
    },
    {
      key: 'department_id',
      header: 'Department',
      render: (a) => departments.find((d) => d.id === a.department_id)?.name || '-',
    },
    { key: 'start_date', header: 'Start Date' },
    {
      key: 'salary',
      header: 'Salary',
      render: (a) => `$${(a.salary || 0).toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => <StatusBadge status={a.status} />,
    },
  ];

  const handleAdd = () => {
    setEditingAssignment(null);
    setFormData({ employee_id: '', job_id: '', department_id: '', start_date: '', end_date: '', status: 'active', salary: 0 });
    setIsDialogOpen(true);
  };

  const handleEdit = (assignment: JobAssignment) => {
    setEditingAssignment(assignment);
    setFormData({
      employee_id: assignment.employee_id,
      job_id: assignment.job_id,
      department_id: assignment.department_id || '',
      start_date: assignment.start_date,
      end_date: assignment.end_date || '',
      status: assignment.status,
      salary: assignment.salary || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (assignment: JobAssignment) => {
    try {
      await deleteAssignment.mutateAsync(assignment.id);
      toast({ title: 'Assignment deleted', description: 'Job assignment has been removed.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete assignment.', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        employee_id: formData.employee_id,
        job_id: formData.job_id,
        department_id: formData.department_id || null,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        status: formData.status,
        salary: formData.salary || null,
      };
      if (editingAssignment) {
        await updateAssignment.mutateAsync({ id: editingAssignment.id, ...dataToSave });
        toast({ title: 'Assignment updated', description: 'Job assignment has been updated.' });
      } else {
        await createAssignment.mutateAsync(dataToSave);
        toast({ title: 'Assignment added', description: 'New job assignment has been added.' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save assignment.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageHeader title="Job Assignments" description="Manage employee job assignments" />
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
        title="Job Assignments"
        description="Manage employee job assignments"
        actionLabel="Add Assignment"
        onAction={handleAdd}
      />

      <DataTable
        data={assignments}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAssignment ? 'Edit Assignment' : 'Add Assignment'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select value={formData.employee_id} onValueChange={(v) => setFormData({ ...formData, employee_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</SelectItem>
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
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
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {editingAssignment ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
