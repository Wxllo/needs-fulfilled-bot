import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { jobs as initialJobs } from '@/data/mockData';
import { Job } from '@/types/hrms';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    description: '',
    level: 'Entry',
    minSalary: 0,
    maxSalary: 0,
    status: 'Active',
    category: '',
  });

  const columns: Column<Job>[] = [
    { key: 'title', header: 'Job Title' },
    { key: 'category', header: 'Category' },
    { key: 'level', header: 'Level' },
    {
      key: 'salary',
      header: 'Salary Range',
      render: (job) => `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (job) => <StatusBadge status={job.status} />,
    },
  ];

  const handleAdd = () => {
    setEditingJob(null);
    setFormData({ title: '', description: '', level: 'Entry', minSalary: 0, maxSalary: 0, status: 'Active', category: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData(job);
    setIsDialogOpen(true);
  };

  const handleDelete = (job: Job) => {
    setJobs(jobs.filter((j) => j.id !== job.id));
    toast({ title: 'Job deleted', description: `${job.title} has been removed.` });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingJob) {
      setJobs(jobs.map((j) => (j.id === editingJob.id ? { ...j, ...formData } as Job : j)));
      toast({ title: 'Job updated', description: 'Job details have been updated.' });
    } else {
      const newJob: Job = {
        ...formData as Job,
        id: String(Date.now()),
      };
      setJobs([...jobs, newJob]);
      toast({ title: 'Job added', description: 'New job has been added.' });
    }
    setIsDialogOpen(false);
  };

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
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v as Job['level'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry">Entry</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minSalary">Min Salary</Label>
                <Input
                  id="minSalary"
                  type="number"
                  value={formData.minSalary}
                  onChange={(e) => setFormData({ ...formData, minSalary: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxSalary">Max Salary</Label>
                <Input
                  id="maxSalary"
                  type="number"
                  value={formData.maxSalary}
                  onChange={(e) => setFormData({ ...formData, maxSalary: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Job['status'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
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
