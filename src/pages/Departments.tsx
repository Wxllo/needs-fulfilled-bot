import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment, useFaculties, useEmployees, Department } from '@/hooks/useSupabaseData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function Departments() {
  const { data: departments = [], isLoading } = useDepartments();
  const { data: faculties = [] } = useFaculties();
  const { data: employees = [] } = useEmployees();
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    faculty_id: '',
    location: '',
    contact_email: '',
    manager_id: '',
  });

  const columns: Column<Department>[] = [
    { key: 'name', header: 'Department Name' },
    {
      key: 'faculty_id',
      header: 'Faculty',
      render: (dept) => faculties.find((f) => f.id === dept.faculty_id)?.name || '-',
    },
    { key: 'location', header: 'Location' },
    { key: 'contact_email', header: 'Contact Email' },
    {
      key: 'manager_id',
      header: 'Manager',
      render: (dept) => {
        const manager = employees.find((e) => e.id === dept.manager_id);
        return manager ? `${manager.first_name} ${manager.last_name}` : '-';
      },
    },
  ];

  const handleAdd = () => {
    setEditingDepartment(null);
    setFormData({ name: '', faculty_id: '', location: '', contact_email: '', manager_id: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      faculty_id: department.faculty_id || '',
      location: department.location || '',
      contact_email: department.contact_email || '',
      manager_id: department.manager_id || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (department: Department) => {
    try {
      await deleteDepartment.mutateAsync(department.id);
      toast({ title: 'Department deleted', description: `${department.name} has been removed.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete department.', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        name: formData.name,
        faculty_id: formData.faculty_id || null,
        location: formData.location || null,
        contact_email: formData.contact_email || null,
        manager_id: formData.manager_id || null,
      };
      if (editingDepartment) {
        await updateDepartment.mutateAsync({ id: editingDepartment.id, ...dataToSave });
        toast({ title: 'Department updated', description: 'Department details have been updated.' });
      } else {
        await createDepartment.mutateAsync(dataToSave);
        toast({ title: 'Department added', description: 'New department has been added.' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save department.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageHeader title="Departments" description="Manage department information" />
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
              <Select value={formData.faculty_id} onValueChange={(v) => setFormData({ ...formData, faculty_id: v })}>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Select value={formData.manager_id} onValueChange={(v) => setFormData({ ...formData, manager_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</SelectItem>
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
