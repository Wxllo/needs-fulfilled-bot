import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { usePerformanceCycles, useCreatePerformanceCycle, useUpdatePerformanceCycle, useDeletePerformanceCycle, PerformanceCycle } from '@/hooks/useSupabaseData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from '@/integrations/supabase/types';

type CycleStatus = Database['public']['Enums']['cycle_status'];

export default function PerformanceCycles() {
  const { data: cycles = [], isLoading } = usePerformanceCycles();
  const createCycle = useCreatePerformanceCycle();
  const updateCycle = useUpdatePerformanceCycle();
  const deleteCycle = useDeletePerformanceCycle();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<PerformanceCycle | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    status: 'draft' as CycleStatus,
    description: '',
  });

  const columns: Column<PerformanceCycle>[] = [
    { key: 'name', header: 'Cycle Name' },
    { key: 'start_date', header: 'Start Date' },
    { key: 'end_date', header: 'End Date' },
    { key: 'description', header: 'Description' },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <StatusBadge status={c.status} />,
    },
  ];

  const handleAdd = () => {
    setEditingCycle(null);
    setFormData({ name: '', start_date: '', end_date: '', status: 'draft', description: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (cycle: PerformanceCycle) => {
    setEditingCycle(cycle);
    setFormData({
      name: cycle.name,
      start_date: cycle.start_date,
      end_date: cycle.end_date,
      status: cycle.status,
      description: cycle.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (cycle: PerformanceCycle) => {
    try {
      await deleteCycle.mutateAsync(cycle.id);
      toast({ title: 'Cycle deleted', description: `${cycle.name} has been removed.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete cycle.', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        name: formData.name,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
        description: formData.description || null,
      };
      if (editingCycle) {
        await updateCycle.mutateAsync({ id: editingCycle.id, ...dataToSave });
        toast({ title: 'Cycle updated', description: 'Performance cycle has been updated.' });
      } else {
        await createCycle.mutateAsync(dataToSave);
        toast({ title: 'Cycle added', description: 'New performance cycle has been added.' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save cycle.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageHeader title="Performance Cycles" description="Manage performance review cycles" />
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
        title="Performance Cycles"
        description="Manage performance review cycles"
        actionLabel="Add Cycle"
        onAction={handleAdd}
      />

      <DataTable
        data={cycles}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search cycles..."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCycle ? 'Edit Cycle' : 'Add Cycle'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Cycle Name</Label>
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
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as CycleStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {editingCycle ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
