import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { useJobs, useCreateJob, useUpdateJob, useDeleteJob, Job } from '@/hooks/useSupabaseData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from '@/integrations/supabase/types';

type JobLevel = Database['public']['Enums']['job_level'];
type JobStatus = Database['public']['Enums']['job_status'];

export default function Jobs() {
  const { data: jobs = [], isLoading } = useJobs();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'entry' as JobLevel,
    min_salary: 0,
    max_salary: 0,
    status: 'open' as JobStatus,
    category: '',
  });

  const columns: Column<Job>[] = [
    { key: 'title', header: 'Job Title' },
    { key: 'category', header: 'Category' },
    { key: 'level', header: 'Level' },
    {
      key: 'salary',
      header: 'Salary Range',
      render: (job) => `$${(job.min_salary || 0).toLocaleString()} - $${(job.max_salary || 0).toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (job) => <StatusBadge status={job.status} />,
    },
  ];

  const handleAdd = () => {
    setEditingJob(null);
    setFormData({ title: '', description: '', level: 'entry', min_salary: 0, max_salary: 0, status: 'open', category: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description || '',
      level: job.level,
      min_salary: job.min_salary || 0,
      max_salary: job.max_salary || 0,
      status: job.status,
      category: job.category || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (job: Job) => {
    try {
      await deleteJob.mutateAsync(job.id);
      toast({ title: 'Job deleted', description: `${job.title} has been removed.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete job.', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        title: formData.title,
        description: formData.description || null,
        level: formData.level,
        min_salary: formData.min_salary || null,
        max_salary: formData.max_salary || null,
        status: formData.status,
        category: formData.category || null,
      };
      if (editingJob) {
        await updateJob.mutateAsync({ id: editingJob.id, ...dataToSave });
        toast({ title: 'Job updated', description: 'Job details have been updated.' });
      } else {
        await createJob.mutateAsync(dataToSave);
        toast({ title: 'Job added', description: 'New job has been added.' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save job.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageHeader title="Jobs" description="Manage job positions" />
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
        title="Jobs"
        description="Manage job positions"
        actionLabel="Add Job"
        onAction={handleAdd}
      />

      <DataTable
        data={jobs}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Search jobs..."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job' : 'Add Job'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v as JobLevel })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="director">Director</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_salary">Min Salary</Label>
                <Input
                  id="min_salary"
                  type="number"
                  value={formData.min_salary}
                  onChange={(e) => setFormData({ ...formData, min_salary: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_salary">Max Salary</Label>
                <Input
                  id="max_salary"
                  type="number"
                  value={formData.max_salary}
                  onChange={(e) => setFormData({ ...formData, max_salary: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as JobStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {editingJob ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
