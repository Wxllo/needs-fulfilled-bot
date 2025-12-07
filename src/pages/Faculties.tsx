import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { useFaculties, useCreateFaculty, useUpdateFaculty, useDeleteFaculty, useUniversities, Faculty } from '@/hooks/useSupabaseData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function Faculties() {
  const { data: faculties = [], isLoading } = useFaculties();
  const { data: universities = [] } = useUniversities();
  const createFaculty = useCreateFaculty();
  const updateFaculty = useUpdateFaculty();
  const deleteFaculty = useDeleteFaculty();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    university_id: '',
    location: '',
    contact_email: '',
  });

  const columns: Column<Faculty>[] = [
    { key: 'name', header: 'Faculty Name' },
    {
      key: 'university_id',
      header: 'University',
      render: (f) => universities.find((u) => u.id === f.university_id)?.name || '-',
    },
    { key: 'location', header: 'Location' },
    { key: 'contact_email', header: 'Contact Email' },
  ];

  const handleAdd = () => {
    setEditingFaculty(null);
    setFormData({ name: '', university_id: '', location: '', contact_email: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      university_id: faculty.university_id || '',
      location: faculty.location || '',
      contact_email: faculty.contact_email || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (faculty: Faculty) => {
    try {
      await deleteFaculty.mutateAsync(faculty.id);
      toast({ title: 'Faculty deleted', description: `${faculty.name} has been removed.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete faculty.', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        name: formData.name,
        university_id: formData.university_id || null,
        location: formData.location || null,
        contact_email: formData.contact_email || null,
      };
      if (editingFaculty) {
        await updateFaculty.mutateAsync({ id: editingFaculty.id, ...dataToSave });
        toast({ title: 'Faculty updated', description: 'Faculty details have been updated.' });
      } else {
        await createFaculty.mutateAsync(dataToSave);
        toast({ title: 'Faculty added', description: 'New faculty has been added.' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save faculty.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageHeader title="Faculties" description="Manage faculty information" />
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
        title="Faculties"
        description="Manage faculty information"
        actionLabel="Add Faculty"
        onAction={handleAdd}
      />

      <DataTable
        data={faculties}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search faculties..."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFaculty ? 'Edit Faculty' : 'Add Faculty'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Faculty Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Select value={formData.university_id} onValueChange={(v) => setFormData({ ...formData, university_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((uni) => (
                    <SelectItem key={uni.id} value={uni.id}>{uni.name}</SelectItem>
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
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {editingFaculty ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
