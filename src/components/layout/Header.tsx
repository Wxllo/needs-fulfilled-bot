import { Building2, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'Human Resources Management System' }: HeaderProps) {
  const { user, signOut, userRole } = useAuth();

  const getInitials = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  const getRoleBadgeVariant = () => {
    if (userRole === 'admin') return 'destructive';
    if (userRole === 'hr_manager') return 'default';
    return 'secondary';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        <span className="text-lg font-medium text-foreground">{title}</span>
      </div>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-sm">{user.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <span>{user.user_metadata?.first_name} {user.user_metadata?.last_name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
                <Badge variant={getRoleBadgeVariant()} className="w-fit mt-1 capitalize">
                  {userRole || 'employee'}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
