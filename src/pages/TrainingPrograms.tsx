import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { trainingPrograms as initialPrograms } from '@/data/mockData';
import { TrainingProgram } from '@/types/hrms';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function TrainingPrograms() {
  const [programs, setPrograms] = useState<TrainingProgram[]>(initialPrograms);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<TrainingProgram>>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Upcoming',
    capacity: 0,
    enrolledCount: 0,
  });

  const columns: Column<TrainingProgram>[] = [
    { key: 'name', header: 'Program Name' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    {
      key: 'enrollment',
      header: 'Enrollment',
      render: (p) => (
        <div className="flex items-center gap-2">
          <Progress value={(p.enrolledCount / p.capacity) * 100} className="w-20 h-2" />
          <span className="text-sm text-muted-foreground">{p.enrolledCount}/{p.capacity}</span>
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
    setFormData({ name: '', description: '', startDate: '', endDate: '', status: 'Upcoming', capacity: 0, enrolledCount: 0 });
    setIsDialogOpen(true);
  };

  const handleEdit = (program: TrainingProgram) => {
    setEditingProgram(program);
    setFormData(program);
    setIsDialogOpen(true);
  };

  const handleDelete = (program: TrainingProgram) => {
    setPrograms(programs.filter((p) => p.id !== program.id));
    toast({ title: 'Program deleted', description: `${program.name} has been removed.` });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgram) {
      setPrograms(programs.map((p) => (p.id === editingProgram.id ? { ...p, ...formData } as TrainingProgram : p)));
      toast({ title: 'Program updated', description: 'Training program has been updated.' });
    } else {
      const newProgram: TrainingProgram = {
        ...formData as TrainingProgram,
        id: String(Date.now()),
      };
      setPrograms([...programs, newProgram]);
      toast({ title: 'Program added', description: 'New training program has been added.' });
    }
    setIsDialogOpen(false);
  };

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
                required
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
                <Label htmlFor="enrolledCount">Enrolled Count</Label>
                <Input
                  id="enrolledCount"
                  type="number"
                  value={formData.enrolledCount}
                  onChange={(e) => setFormData({ ...formData, enrolledCount: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as TrainingProgram['status'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
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
