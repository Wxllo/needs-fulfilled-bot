import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { employees as initialEmployees, departments, jobs } from '@/data/mockData';
import { Employee } from '@/types/hrms';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    jobId: '',
    hireDate: '',
    status: 'Active',
    gender: 'Male',
    dateOfBirth: '',
  });

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (emp) => `${emp.firstName} ${emp.lastName}`,
    },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'departmentId',
      header: 'Department',
      render: (emp) => departments.find((d) => d.id === emp.departmentId)?.name || '-',
    },
    {
      key: 'jobId',
      header: 'Job',
      render: (emp) => jobs.find((j) => j.id === emp.jobId)?.title || '-',
    },
    { key: 'hireDate', header: 'Hire Date' },
    {
      key: 'status',
      header: 'Status',
      render: (emp) => <StatusBadge status={emp.status} />,
    },
  ];

  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      departmentId: '',
      jobId: '',
      hireDate: '',
      status: 'Active',
      gender: 'Male',
      dateOfBirth: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData(employee);
    setIsDialogOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setEmployees(employees.filter((e) => e.id !== employee.id));
    toast({ title: 'Employee deleted', description: `${employee.firstName} ${employee.lastName} has been removed.` });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      setEmployees(employees.map((emp) => (emp.id === editingEmployee.id ? { ...emp, ...formData } as Employee : emp)));
      toast({ title: 'Employee updated', description: 'Employee details have been updated.' });
    } else {
      const newEmployee: Employee = {
        ...formData as Employee,
        id: String(Date.now()),
      };
      setEmployees([...employees, newEmployee]);
      toast({ title: 'Employee added', description: 'New employee has been added.' });
    }
    setIsDialogOpen(false);
  };

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
        searchKey="firstName"
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
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                  required
                />
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
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Employee['status'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Probation">Probation</SelectItem>
                    <SelectItem value="Leave">Leave</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v as Employee['gender'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
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
