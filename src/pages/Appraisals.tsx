import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { appraisals as initialAppraisals, employees, performanceCycles } from '@/data/mockData';
import { Appraisal } from '@/types/hrms';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function Appraisals() {
  const [appraisals, setAppraisals] = useState<Appraisal[]>(initialAppraisals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppraisal, setEditingAppraisal] = useState<Appraisal | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Appraisal>>({
    employeeId: '',
    cycleId: '',
    reviewerId: '',
    score: 0,
    comments: '',
    status: 'Pending',
    createdAt: '',
  });

  const columns: Column<Appraisal>[] = [
    {
      key: 'employeeId',
      header: 'Employee',
      render: (a) => {
        const emp = employees.find((e) => e.id === a.employeeId);
        return emp ? `${emp.firstName} ${emp.lastName}` : '-';
      },
    },
    {
      key: 'cycleId',
      header: 'Cycle',
      render: (a) => performanceCycles.find((c) => c.id === a.cycleId)?.name || '-',
    },
    {
      key: 'reviewerId',
      header: 'Reviewer',
      render: (a) => {
        const reviewer = employees.find((e) => e.id === a.reviewerId);
        return reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : '-';
      },
    },
    {
      key: 'score',
      header: 'Score',
      render: (a) => (
        <span className="font-semibold text-kpi-blue">{a.score}/5</span>
      ),
    },
    { key: 'createdAt', header: 'Date' },
    {
      key: 'status',
      header: 'Status',
      render: (a) => <StatusBadge status={a.status} />,
    },
  ];

  const handleAdd = () => {
    setEditingAppraisal(null);
    setFormData({ employeeId: '', cycleId: '', reviewerId: '', score: 0, comments: '', status: 'Pending', createdAt: new Date().toISOString().split('T')[0] });
    setIsDialogOpen(true);
  };

  const handleEdit = (appraisal: Appraisal) => {
    setEditingAppraisal(appraisal);
    setFormData(appraisal);
    setIsDialogOpen(true);
  };

  const handleDelete = (appraisal: Appraisal) => {
    setAppraisals(appraisals.filter((a) => a.id !== appraisal.id));
    toast({ title: 'Appraisal deleted', description: 'Appraisal has been removed.' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAppraisal) {
      setAppraisals(appraisals.map((a) => (a.id === editingAppraisal.id ? { ...a, ...formData } as Appraisal : a)));
      toast({ title: 'Appraisal updated', description: 'Appraisal has been updated.' });
    } else {
      const newAppraisal: Appraisal = {
        ...formData as Appraisal,
        id: String(Date.now()),
      };
      setAppraisals([...appraisals, newAppraisal]);
      toast({ title: 'Appraisal added', description: 'New appraisal has been added.' });
    }
    setIsDialogOpen(false);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Appraisals"
        description="Manage employee performance appraisals"
        actionLabel="Add Appraisal"
        onAction={handleAdd}
      />

      <DataTable
        data={appraisals}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAppraisal ? 'Edit Appraisal' : 'Add Appraisal'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select value={formData.employeeId} onValueChange={(v) => setFormData({ ...formData, employeeId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycle">Performance Cycle</Label>
              <Select value={formData.cycleId} onValueChange={(v) => setFormData({ ...formData, cycleId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cycle" />
                </SelectTrigger>
                <SelectContent>
                  {performanceCycles.map((cycle) => (
                    <SelectItem key={cycle.id} value={cycle.id}>{cycle.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select value={formData.reviewerId} onValueChange={(v) => setFormData({ ...formData, reviewerId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="score">Score (0-5)</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Appraisal['status'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {editingAppraisal ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
