import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { universities as initialUniversities } from '@/data/mockData';
import { University } from '@/types/hrms';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Universities() {
  const [universities, setUniversities] = useState<University[]>(initialUniversities);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<University>>({
    name: '',
    location: '',
    contactEmail: '',
  });

  const columns: Column<University>[] = [
    { key: 'name', header: 'University Name' },
    { key: 'location', header: 'Location' },
    { key: 'contactEmail', header: 'Contact Email' },
  ];

  const handleAdd = () => {
    setEditingUniversity(null);
    setFormData({ name: '', location: '', contactEmail: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (university: University) => {
    setEditingUniversity(university);
    setFormData(university);
    setIsDialogOpen(true);
  };

  const handleDelete = (university: University) => {
    setUniversities(universities.filter((u) => u.id !== university.id));
    toast({ title: 'University deleted', description: `${university.name} has been removed.` });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUniversity) {
      setUniversities(universities.map((u) => (u.id === editingUniversity.id ? { ...u, ...formData } as University : u)));
      toast({ title: 'University updated', description: 'University details have been updated.' });
    } else {
      const newUniversity: University = {
        ...formData as University,
        id: String(Date.now()),
      };
      setUniversities([...universities, newUniversity]);
      toast({ title: 'University added', description: 'New university has been added.' });
    }
    setIsDialogOpen(false);
  };

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
