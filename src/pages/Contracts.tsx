import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable, Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { employees } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Contract {
  id: string;
  employeeId: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
  startDate: string;
  endDate?: string;
  salary: number;
  status: 'Active' | 'Expired' | 'Terminated';
}

const initialContracts: Contract[] = [
  { id: '1', employeeId: '1', type: 'Full-Time', startDate: '2020-03-15', salary: 18000, status: 'Active' },
  { id: '2', employeeId: '2', type: 'Full-Time', startDate: '2019-06-01', salary: 16000, status: 'Active' },
  { id: '3', employeeId: '3', type: 'Contract', startDate: '2021-01-10', endDate: '2024-01-10', salary: 7500, status: 'Active' },
  { id: '4', employeeId: '4', type: 'Full-Time', startDate: '2018-09-20', salary: 19000, status: 'Active' },
  { id: '5', employeeId: '5', type: 'Full-Time', startDate: '2022-04-05', salary: 12000, status: 'Active' },
  { id: '6', employeeId: '6', type: 'Internship', startDate: '2023-02-14', endDate: '2023-08-14', salary: 3000, status: 'Active' },
];

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Contract>>({
    employeeId: '',
    type: 'Full-Time',
    startDate: '',
    endDate: '',
    salary: 0,
    status: 'Active',
  });

  const columns: Column<Contract>[] = [
    {
      key: 'employeeId',
      header: 'Employee',
      render: (c) => {
        const emp = employees.find((e) => e.id === c.employeeId);
        return emp ? `${emp.firstName} ${emp.lastName}` : '-';
      },
    },
    { key: 'type', header: 'Contract Type' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date', render: (c) => c.endDate || 'Indefinite' },
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
    setFormData({ employeeId: '', type: 'Full-Time', startDate: '', endDate: '', salary: 0, status: 'Active' });
    setIsDialogOpen(true);
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setFormData(contract);
    setIsDialogOpen(true);
  };

  const handleDelete = (contract: Contract) => {
    setContracts(contracts.filter((c) => c.id !== contract.id));
    toast({ title: 'Contract deleted', description: 'Contract has been removed.' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContract) {
      setContracts(contracts.map((c) => (c.id === editingContract.id ? { ...c, ...formData } as Contract : c)));
      toast({ title: 'Contract updated', description: 'Contract has been updated.' });
    } else {
      const newContract: Contract = {
        ...formData as Contract,
        id: String(Date.now()),
      };
      setContracts([...contracts, newContract]);
      toast({ title: 'Contract added', description: 'New contract has been added.' });
    }
    setIsDialogOpen(false);
  };

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
              <Label htmlFor="type">Contract Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as Contract['type'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-Time">Full-Time</SelectItem>
                  <SelectItem value="Part-Time">Part-Time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
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
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Contract['status'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Terminated">Terminated</SelectItem>
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
