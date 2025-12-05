import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { departments as initialDepartments, faculties, employees } from '@/data/mockData';
import { Department } from '@/types/hrms';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Department>>({
    name: '',
    facultyId: '',
    location: '',
    contactEmail: '',
    managerId: '',
  });

  const columns: Column<Department>[] = [
    { key: 'name', header: 'Department Name' },
    {
      key: 'facultyId',
      header: 'Faculty',
      render: (dept) => faculties.find((f) => f.id === dept.facultyId)?.name || '-',
    },
    { key: 'location', header: 'Location' },
    { key: 'contactEmail', header: 'Contact Email' },
    {
      key: 'managerId',
      header: 'Manager',
      render: (dept) => {
        const manager = employees.find((e) => e.id === dept.managerId);
        return manager ? `${manager.firstName} ${manager.lastName}` : '-';
      },
    },
  ];

  const handleAdd = () => {
    setEditingDepartment(null);
    setFormData({ name: '', facultyId: '', location: '', contactEmail: '', managerId: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData(department);
    setIsDialogOpen(true);
  };

  const handleDelete = (department: Department) => {
    setDepartments(departments.filter((d) => d.id !== department.id));
    toast({ title: 'Department deleted', description: `${department.name} has been removed.` });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDepartment) {
      setDepartments(departments.map((d) => (d.id === editingDepartment.id ? { ...d, ...formData } as Department : d)));
      toast({ title: 'Department updated', description: 'Department details have been updated.' });
    } else {
      const newDepartment: Department = {
        ...formData as Department,
        id: String(Date.now()),
      };
      setDepartments([...departments, newDepartment]);
      toast({ title: 'Department added', description: 'New department has been added.' });
    }
    setIsDialogOpen(false);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Departments"
        description="Manage department information"
        actionLabel="Add Department"
        onAction={handleAdd}
      />

      <DataTable
        data={departments}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search departments..."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDepartment ? 'Edit Department' : 'Add Department'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty</Label>
              <Select value={formData.facultyId} onValueChange={(v) => setFormData({ ...formData, facultyId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((faculty) => (
                    <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Select value={formData.managerId} onValueChange={(v) => setFormData({ ...formData, managerId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {editingDepartment ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
