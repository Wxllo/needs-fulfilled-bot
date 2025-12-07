import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { useUniversities, useCreateUniversity, useUpdateUniversity, useDeleteUniversity, University } from '@/hooks/useSupabaseData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function Universities() {
  const { data: universities = [], isLoading } = useUniversities();
  const createUniversity = useCreateUniversity();
  const updateUniversity = useUpdateUniversity();
  const deleteUniversity = useDeleteUniversity();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contact_email: '',
  });

  const columns: Column<University>[] = [
    { key: 'name', header: 'University Name' },
    { key: 'location', header: 'Location' },
    { key: 'contact_email', header: 'Contact Email' },
  ];

  const handleAdd = () => {
    setEditingUniversity(null);
    setFormData({ name: '', location: '', contact_email: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (university: University) => {
    setEditingUniversity(university);
    setFormData({
      name: university.name,
      location: university.location || '',
      contact_email: university.contact_email || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (university: University) => {
    try {
      await deleteUniversity.mutateAsync(university.id);
      toast({ title: 'University deleted', description: `${university.name} has been removed.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete university.', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUniversity) {
        await updateUniversity.mutateAsync({ id: editingUniversity.id, ...formData });
        toast({ title: 'University updated', description: 'University details have been updated.' });
      } else {
        await createUniversity.mutateAsync(formData);
        toast({ title: 'University added', description: 'New university has been added.' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save university.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageHeader title="Universities" description="Manage university information" />
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
        title="Universities"
        description="Manage university information"
        actionLabel="Add University"
        onAction={handleAdd}
      />

      <DataTable
        data={universities}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search universities..."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUniversity ? 'Edit University' : 'Add University'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">University Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
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
                {editingUniversity ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
