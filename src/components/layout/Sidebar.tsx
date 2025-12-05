import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Building,
  Users,
  FileText,
  Briefcase,
  ClipboardList,
  Target,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: '',
    items: [
      { title: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Organization',
    items: [
      { title: 'Universities', href: '/universities', icon: Building2 },
      { title: 'Faculties', href: '/faculties', icon: GraduationCap },
      { title: 'Departments', href: '/departments', icon: Building },
    ],
  },
  {
    title: 'Human Resources',
    items: [
      { title: 'Employees', href: '/employees', icon: Users },
      { title: 'Contracts', href: '/contracts', icon: FileText },
      { title: 'Jobs', href: '/jobs', icon: Briefcase },
      { title: 'Job Assignments', href: '/job-assignments', icon: ClipboardList },
    ],
  },
  {
    title: 'Performance',
    items: [
      { title: 'Performance Cycles', href: '/performance-cycles', icon: Target },
      { title: 'KPI Scores', href: '/kpi-scores', icon: TrendingUp },
      { title: 'Appraisals', href: '/appraisals', icon: Award },
    ],
  },
  {
    title: 'Training',
    items: [
      { title: 'Training Programs', href: '/training-programs', icon: BookOpen },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">HR Portal</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4">
              {group.title && (
                <h3 className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-muted">
                  {group.title}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium sidebar-transition',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
