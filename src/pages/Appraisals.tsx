import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAppraisals, useCreateAppraisal, useUpdateAppraisal, useDeleteAppraisal, useEmployees, usePerformanceCycles, Appraisal } from '@/hooks/useSupabaseData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from '@/integrations/supabase/types';

type AppraisalStatus = Database['public']['Enums']['appraisal_status'];

export default function Appraisals() {
  const { data: appraisals = [], isLoading } = useAppraisals();
  const { data: employees = [] } = useEmployees();
  const { data: cycles = [] } = usePerformanceCycles();
  const createAppraisal = useCreateAppraisal();
  const updateAppraisal = useUpdateAppraisal();
  const deleteAppraisal = useDeleteAppraisal();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppraisal, setEditingAppraisal] = useState<Appraisal | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    employee_id: '',
    cycle_id: '',
    reviewer_id: '',
    score: 0,
    comments: '',
    status: 'pending' as AppraisalStatus,
  });

  const columns: Column<Appraisal>[] = [
    {
      key: 'employee_id',
      header: 'Employee',
      render: (a) => {
        const emp = employees.find((e) => e.id === a.employee_id);
        return emp ? `${emp.first_name} ${emp.last_name}` : '-';
      },
    },
    {
      key: 'cycle_id',
      header: 'Cycle',
      render: (a) => cycles.find((c) => c.id === a.cycle_id)?.name || '-',
    },
    {
      key: 'reviewer_id',
      header: 'Reviewer',
      render: (a) => {
        const reviewer = employees.find((e) => e.id === a.reviewer_id);
        return reviewer ? `${reviewer.first_name} ${reviewer.last_name}` : '-';
      },
    },
    {
      key: 'score',
      header: 'Score',
      render: (a) => (
        <span className="font-semibold text-kpi-blue">{a.score || 0}/5</span>
      ),
    },
    { key: 'created_at', header: 'Date', render: (a) => a.created_at.split('T')[0] },
    {
      key: 'status',
      header: 'Status',
      render: (a) => <StatusBadge status={a.status} />,
    },
  ];

  const handleAdd = () => {
    setEditingAppraisal(null);
    setFormData({ employee_id: '', cycle_id: '', reviewer_id: '', score: 0, comments: '', status: 'pending' });
    setIsDialogOpen(true);
  };

  const handleEdit = (appraisal: Appraisal) => {
    setEditingAppraisal(appraisal);
    setFormData({
      employee_id: appraisal.employee_id,
      cycle_id: appraisal.cycle_id,
      reviewer_id: appraisal.reviewer_id || '',
      score: appraisal.score || 0,
      comments: appraisal.comments || '',
      status: appraisal.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (appraisal: Appraisal) => {
    try {
      await deleteAppraisal.mutateAsync(appraisal.id);
      toast({ title: 'Appraisal deleted', description: 'Appraisal has been removed.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete appraisal.', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        employee_id: formData.employee_id,
        cycle_id: formData.cycle_id,
        reviewer_id: formData.reviewer_id || null,
        score: formData.score || null,
        comments: formData.comments || null,
        status: formData.status,
      };
      if (editingAppraisal) {
        await updateAppraisal.mutateAsync({ id: editingAppraisal.id, ...dataToSave });
        toast({ title: 'Appraisal updated', description: 'Appraisal has been updated.' });
      } else {
        await createAppraisal.mutateAsync(dataToSave);
        toast({ title: 'Appraisal added', description: 'New appraisal has been added.' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save appraisal.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageHeader title="Appraisals" description="Manage employee performance appraisals" />
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
              <Select value={formData.employee_id} onValueChange={(v) => setFormData({ ...formData, employee_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycle">Performance Cycle</Label>
              <Select value={formData.cycle_id} onValueChange={(v) => setFormData({ ...formData, cycle_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cycle" />
                </SelectTrigger>
                <SelectContent>
                  {cycles.map((cycle) => (
                    <SelectItem key={cycle.id} value={cycle.id}>{cycle.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select value={formData.reviewer_id} onValueChange={(v) => setFormData({ ...formData, reviewer_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</SelectItem>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as AppraisalStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
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
