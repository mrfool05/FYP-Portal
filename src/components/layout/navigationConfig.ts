import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Upload,
  BarChart3,
  Megaphone,
  Award,
  User,
  UserCheck,
  ClipboardList,
  FileSearch,
  Settings,
  ShieldCheck,
  Calendar,
  BookOpen,
  FileSpreadsheet,
  Lock,
  Activity,
  LucideIcon,
} from 'lucide-react';
import { UserRole } from '@/types';

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const studentNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
  { label: 'Supervisor Selection', href: '/student/supervisor', icon: UserCheck },
  { label: 'My Group', href: '/student/group', icon: Users },
  { label: 'Project Idea', href: '/student/project', icon: FolderKanban },
  { label: 'Documents', href: '/student/documents', icon: Upload },
  { label: 'Progress', href: '/student/progress', icon: BarChart3 },
  { label: 'Announcements', href: '/student/announcements', icon: Megaphone },
  { label: 'Evaluation', href: '/student/evaluation', icon: Award },
  { label: 'Profile', href: '/student/profile', icon: User },
];

const supervisorNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/supervisor', icon: LayoutDashboard },
  { label: 'Requests', href: '/supervisor/requests', icon: ClipboardList },
  { label: 'My Groups', href: '/supervisor/groups', icon: Users },
  { label: 'Idea Review', href: '/supervisor/ideas', icon: FileSearch },
  { label: 'Document Review', href: '/supervisor/documents', icon: FileText },
  { label: 'Evaluation', href: '/supervisor/evaluation', icon: Award },
  { label: 'Announcements', href: '/supervisor/announcements', icon: Megaphone },
];

const pmoNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/pmo', icon: LayoutDashboard },
  { label: 'User Management', href: '/pmo/users', icon: Users },
  { label: 'Project Approval', href: '/pmo/approvals', icon: FolderKanban },
  { label: 'Announcements', href: '/pmo/announcements', icon: Megaphone },
  { label: 'Supervisor Assignment', href: '/pmo/assignments', icon: UserCheck },
  { label: 'Progress Monitor', href: '/pmo/progress', icon: BarChart3 },
  { label: 'Templates', href: '/pmo/templates', icon: FileText },
  { label: 'Reports', href: '/pmo/reports', icon: FileSpreadsheet },
];

const externalPanelNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/external', icon: LayoutDashboard },
  { label: 'Evaluate Groups', href: '/external/evaluate', icon: Award },
];

const examCellNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/exam-cell', icon: LayoutDashboard },
  { label: 'Compile Results', href: '/exam-cell/compile', icon: FileSpreadsheet },
  { label: 'Publish Results', href: '/exam-cell/publish', icon: Lock },
];

const adminNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Role Management', href: '/admin/roles', icon: ShieldCheck },
  { label: 'Academic Config', href: '/admin/config', icon: Calendar },
  { label: 'Audit Logs', href: '/admin/logs', icon: Activity },
];

export function getNavigationItems(role: UserRole): NavigationItem[] {
  switch (role) {
    case 'student':
      return studentNavigation;
    case 'supervisor':
      return supervisorNavigation;
    case 'pmo':
      return pmoNavigation;
    case 'external_panel':
      return externalPanelNavigation;
    case 'exam_cell':
      return examCellNavigation;
    case 'admin':
      return adminNavigation;
    default:
      return [];
  }
}
