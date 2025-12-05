import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { faculties as initialFaculties, universities } from '@/data/mockData';
import { Faculty } from '@/types/hrms';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Faculties() {
  const [faculties, setFaculties] = useState<Faculty[]>(initialFaculties);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Faculty>>({
    name: '',
    universityId: '',
    location: '',
    contactEmail: '',
  });

  const columns: Column<Faculty>[] = [
    { key: 'name', header: 'Faculty Name' },
    {
      key: 'universityId',
      header: 'University',
      render: (f) => universities.find((u) => u.id === f.universityId)?.name || '-',
    },
    { key: 'location', header: 'Location' },
    { key: 'contactEmail', header: 'Contact Email' },
  ];

  const handleAdd = () => {
    setEditingFaculty(null);
    setFormData({ name: '', universityId: '', location: '', contactEmail: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFormData(faculty);
    setIsDialogOpen(true);
  };

  const handleDelete = (faculty: Faculty) => {
    setFaculties(faculties.filter((f) => f.id !== faculty.id));
    toast({ title: 'Faculty deleted', description: `${faculty.name} has been removed.` });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaculty) {
      setFaculties(faculties.map((f) => (f.id === editingFaculty.id ? { ...f, ...formData } as Faculty : f)));
      toast({ title: 'Faculty updated', description: 'Faculty details have been updated.' });
    } else {
      const newFaculty: Faculty = {
        ...formData as Faculty,
        id: String(Date.now()),
      };
      setFaculties([...faculties, newFaculty]);
      toast({ title: 'Faculty added', description: 'New faculty has been added.' });
    }
    setIsDialogOpen(false);
  };

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
              <Select value={formData.universityId} onValueChange={(v) => setFormData({ ...formData, universityId: v })}>
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
                {editingFaculty ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
