import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { jobAssignments as initialAssignments, employees, jobs, departments } from '@/data/mockData';
import { JobAssignment } from '@/types/hrms';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function JobAssignments() {
  const [assignments, setAssignments] = useState<JobAssignment[]>(initialAssignments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<JobAssignment | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<JobAssignment>>({
    employeeId: '',
    jobId: '',
    departmentId: '',
    startDate: '',
    endDate: '',
    status: 'Active',
    salary: 0,
  });

  const columns: Column<JobAssignment>[] = [
    {
      key: 'employeeId',
      header: 'Employee',
      render: (a) => {
        const emp = employees.find((e) => e.id === a.employeeId);
        return emp ? `${emp.firstName} ${emp.lastName}` : '-';
      },
    },
    {
      key: 'jobId',
      header: 'Job',
      render: (a) => jobs.find((j) => j.id === a.jobId)?.title || '-',
    },
    {
      key: 'departmentId',
      header: 'Department',
      render: (a) => departments.find((d) => d.id === a.departmentId)?.name || '-',
    },
    { key: 'startDate', header: 'Start Date' },
    {
      key: 'salary',
      header: 'Salary',
      render: (a) => `$${a.salary.toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => <StatusBadge status={a.status} />,
    },
  ];

  const handleAdd = () => {
    setEditingAssignment(null);
    setFormData({ employeeId: '', jobId: '', departmentId: '', startDate: '', endDate: '', status: 'Active', salary: 0 });
    setIsDialogOpen(true);
  };

  const handleEdit = (assignment: JobAssignment) => {
    setEditingAssignment(assignment);
    setFormData(assignment);
    setIsDialogOpen(true);
  };

  const handleDelete = (assignment: JobAssignment) => {
    setAssignments(assignments.filter((a) => a.id !== assignment.id));
    toast({ title: 'Assignment deleted', description: 'Job assignment has been removed.' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssignment) {
      setAssignments(assignments.map((a) => (a.id === editingAssignment.id ? { ...a, ...formData } as JobAssignment : a)));
      toast({ title: 'Assignment updated', description: 'Job assignment has been updated.' });
    } else {
      const newAssignment: JobAssignment = {
        ...formData as JobAssignment,
        id: String(Date.now()),
      };
      setAssignments([...assignments, newAssignment]);
      toast({ title: 'Assignment added', description: 'New job assignment has been added.' });
    }
    setIsDialogOpen(false);
  };

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
              <Select value={formData.employeeId} onValueChange={(v) => setFormData({ ...formData, employeeId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job">Job</Label>
              <Select value={formData.jobId} onValueChange={(v) => setFormData({ ...formData, jobId: v })}>
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
              <Select value={formData.departmentId} onValueChange={(v) => setFormData({ ...formData, departmentId: v })}>
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
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as JobAssignment['status'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Terminated">Terminated</SelectItem>
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
