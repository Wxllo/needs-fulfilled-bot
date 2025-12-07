import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { useTrainingPrograms, useCreateTrainingProgram, useUpdateTrainingProgram, useDeleteTrainingProgram, TrainingProgram } from '@/hooks/useSupabaseData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Database } from '@/integrations/supabase/types';

type TrainingStatus = Database['public']['Enums']['training_status'];

export default function TrainingPrograms() {
  const { data: programs = [], isLoading } = useTrainingPrograms();
  const createProgram = useCreateTrainingProgram();
  const updateProgram = useUpdateTrainingProgram();
  const deleteProgram = useDeleteTrainingProgram();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'upcoming' as TrainingStatus,
    capacity: 20,
    enrolled: 0,
  });

  const columns: Column<TrainingProgram>[] = [
    { key: 'name', header: 'Program Name' },
    { key: 'start_date', header: 'Start Date' },
    { key: 'end_date', header: 'End Date' },
    {
      key: 'enrollment',
      header: 'Enrollment',
      render: (p) => (
        <div className="flex items-center gap-2">
          <Progress value={(p.enrolled / p.capacity) * 100} className="w-20 h-2" />
          <span className="text-sm text-muted-foreground">{p.enrolled}/{p.capacity}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <StatusBadge status={p.status} />,
    },
  ];

  const handleAdd = () => {
    setEditingProgram(null);
    setFormData({ name: '', description: '', start_date: '', end_date: '', status: 'upcoming', capacity: 20, enrolled: 0 });
    setIsDialogOpen(true);
  };

  const handleEdit = (program: TrainingProgram) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description || '',
      start_date: program.start_date,
      end_date: program.end_date,
      status: program.status,
      capacity: program.capacity,
      enrolled: program.enrolled,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (program: TrainingProgram) => {
    try {
      await deleteProgram.mutateAsync(program.id);
      toast({ title: 'Program deleted', description: `${program.name} has been removed.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete program.', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        name: formData.name,
        description: formData.description || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
        capacity: formData.capacity,
        enrolled: formData.enrolled,
      };
      if (editingProgram) {
        await updateProgram.mutateAsync({ id: editingProgram.id, ...dataToSave });
        toast({ title: 'Program updated', description: 'Training program has been updated.' });
      } else {
        await createProgram.mutateAsync(dataToSave);
        toast({ title: 'Program added', description: 'New training program has been added.' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save program.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageHeader title="Training Programs" description="Manage training and development programs" />
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
        title="Training Programs"
        description="Manage training and development programs"
        actionLabel="Add Program"
        onAction={handleAdd}
      />

      <DataTable
        data={programs}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search programs..."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProgram ? 'Edit Program' : 'Add Program'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Program Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
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
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrolled">Enrolled Count</Label>
                <Input
                  id="enrolled"
                  type="number"
                  value={formData.enrolled}
                  onChange={(e) => setFormData({ ...formData, enrolled: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as TrainingStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {editingProgram ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
