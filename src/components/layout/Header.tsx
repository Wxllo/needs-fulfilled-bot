import { Building2 } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'Human Resources Management System' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-card px-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        <span className="text-lg font-medium text-foreground">{title}</span>
      </div>
    </header>
  );
}
