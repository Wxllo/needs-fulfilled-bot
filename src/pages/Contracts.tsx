import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { useContracts, useCreateContract, useUpdateContract, useDeleteContract, useEmployees, Contract } from '@/hooks/useSupabaseData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from '@/integrations/supabase/types';

type ContractType = Database['public']['Enums']['contract_type'];
type ContractStatus = Database['public']['Enums']['contract_status'];

export default function Contracts() {
  const { data: contracts = [], isLoading } = useContracts();
  const { data: employees = [] } = useEmployees();
  const createContract = useCreateContract();
  const updateContract = useUpdateContract();
  const deleteContract = useDeleteContract();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    employee_id: '',
    type: 'permanent' as ContractType,
    start_date: '',
    end_date: '',
    salary: 0,
    status: 'active' as ContractStatus,
  });

  const columns: Column<Contract>[] = [
    {
      key: 'employee_id',
      header: 'Employee',
      render: (c) => {
        const emp = employees.find((e) => e.id === c.employee_id);
        return emp ? `${emp.first_name} ${emp.last_name}` : '-';
      },
    },
    { key: 'type', header: 'Contract Type' },
    { key: 'start_date', header: 'Start Date' },
    { key: 'end_date', header: 'End Date', render: (c) => c.end_date || 'Indefinite' },
    {
      key: 'salary',
      header: 'Salary',
      render: (c) => `$${c.salary.toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <StatusBadge status={c.status} />,
    },
  ];

  const handleAdd = () => {
    setEditingContract(null);
    setFormData({ employee_id: '', type: 'permanent', start_date: '', end_date: '', salary: 0, status: 'active' });
    setIsDialogOpen(true);
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setFormData({
      employee_id: contract.employee_id,
      type: contract.type,
      start_date: contract.start_date,
      end_date: contract.end_date || '',
      salary: contract.salary,
      status: contract.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (contract: Contract) => {
    try {
      await deleteContract.mutateAsync(contract.id);
      toast({ title: 'Contract deleted', description: 'Contract has been removed.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete contract.', variant: 'destructive' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        employee_id: formData.employee_id,
        type: formData.type,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        salary: formData.salary,
        status: formData.status,
      };
      if (editingContract) {
        await updateContract.mutateAsync({ id: editingContract.id, ...dataToSave });
        toast({ title: 'Contract updated', description: 'Contract has been updated.' });
      } else {
        await createContract.mutateAsync(dataToSave);
        toast({ title: 'Contract added', description: 'New contract has been added.' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save contract.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageHeader title="Contracts" description="Manage employee contracts" />
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
        title="Contracts"
        description="Manage employee contracts"
        actionLabel="Add Contract"
        onAction={handleAdd}
      />

      <DataTable
        data={contracts}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingContract ? 'Edit Contract' : 'Add Contract'}</DialogTitle>
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
              <Label htmlFor="type">Contract Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as ContractType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
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
                <Label htmlFor="end_date">End Date (Optional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as ContractStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {editingContract ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
