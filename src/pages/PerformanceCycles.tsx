import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { performanceCycles as initialCycles } from '@/data/mockData';
import { PerformanceCycle } from '@/types/hrms';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function PerformanceCycles() {
  const [cycles, setCycles] = useState<PerformanceCycle[]>(initialCycles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<PerformanceCycle | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<PerformanceCycle>>({
    name: '',
    startDate: '',
    endDate: '',
    status: 'Planning',
    description: '',
  });

  const columns: Column<PerformanceCycle>[] = [
    { key: 'name', header: 'Cycle Name' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { key: 'description', header: 'Description' },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <StatusBadge status={c.status} />,
    },
  ];

  const handleAdd = () => {
    setEditingCycle(null);
    setFormData({ name: '', startDate: '', endDate: '', status: 'Planning', description: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (cycle: PerformanceCycle) => {
    setEditingCycle(cycle);
    setFormData(cycle);
    setIsDialogOpen(true);
  };

  const handleDelete = (cycle: PerformanceCycle) => {
    setCycles(cycles.filter((c) => c.id !== cycle.id));
    toast({ title: 'Cycle deleted', description: `${cycle.name} has been removed.` });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCycle) {
      setCycles(cycles.map((c) => (c.id === editingCycle.id ? { ...c, ...formData } as PerformanceCycle : c)));
      toast({ title: 'Cycle updated', description: 'Performance cycle has been updated.' });
    } else {
      const newCycle: PerformanceCycle = {
        ...formData as PerformanceCycle,
        id: String(Date.now()),
      };
      setCycles([...cycles, newCycle]);
      toast({ title: 'Cycle added', description: 'New performance cycle has been added.' });
    }
    setIsDialogOpen(false);
  };

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
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as PerformanceCycle['status'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
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
