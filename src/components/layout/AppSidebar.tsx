import { useAuth } from '@/context/AuthContext';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, FileText, ClipboardList, UserCheck,
  BarChart3, FileSpreadsheet, Video, HelpCircle, User, GraduationCap,
  ChevronLeft, ChevronRight, MessageSquare, Users, Clock, CalendarDays
} from 'lucide-react';
import { useState } from 'react';

const facultyLinks = [
  { title: 'Dashboard', url: '/faculty/dashboard', icon: LayoutDashboard },
  { title: 'Courses', url: '/faculty/courses', icon: BookOpen },
  { title: 'Materials', url: '/faculty/materials', icon: FileText },
  { title: 'Assignments', url: '/faculty/assignments', icon: ClipboardList },
  { title: 'Attendance', url: '/faculty/attendance', icon: UserCheck },
  { title: 'Performance', url: '/faculty/performance', icon: BarChart3 },
  { title: 'Quiz', url: '/faculty/quiz', icon: HelpCircle },
  { title: 'Syllabus', url: '/faculty/syllabus', icon: FileSpreadsheet },
  { title: 'Virtual Classes', url: '/faculty/virtual-classes', icon: Video },
  { title: 'Chat', url: '/faculty/chat', icon: MessageSquare },
  { title: 'Mentoring', url: '/faculty/mentoring', icon: Users },
  { title: 'Timetable', url: '/faculty/timetable', icon: Clock },
  { title: 'Calendar', url: '/faculty/calendar', icon: CalendarDays },
  { title: 'Profile', url: '/faculty/profile', icon: User },
];

const studentLinks = [
  { title: 'Dashboard', url: '/student/dashboard', icon: LayoutDashboard },
  { title: 'Courses', url: '/student/courses', icon: BookOpen },
  { title: 'Materials', url: '/student/materials', icon: FileText },
  { title: 'Assignments', url: '/student/assignments', icon: ClipboardList },
  { title: 'Attendance', url: '/student/attendance', icon: UserCheck },
  { title: 'Quiz', url: '/student/quiz', icon: HelpCircle },
  { title: 'Scores', url: '/student/scores', icon: BarChart3 },
  { title: 'Syllabus', url: '/student/syllabus', icon: FileSpreadsheet },
  { title: 'Virtual Classes', url: '/student/virtual-classes', icon: Video },
  { title: 'Chat', url: '/student/chat', icon: MessageSquare },
  { title: 'My Mentor', url: '/student/mentoring', icon: Users },
  { title: 'Timetable', url: '/student/timetable', icon: Clock },
  { title: 'Calendar', url: '/student/calendar', icon: CalendarDays },
  { title: 'Profile', url: '/student/profile', icon: User },
];

export const AppSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const links = user?.role === 'faculty' ? facultyLinks : studentLinks;

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} min-h-screen bg-card border-r border-border flex flex-col transition-all duration-300 relative`}>
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && <span className="text-lg font-bold text-foreground">EduNexus</span>}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center card-shadow-elevated z-10 hover:scale-110 transition-transform"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Nav links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.url;
          return (
            <NavLink
              key={link.url}
              to={link.url}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive ? '' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              activeClassName="bg-primary/10 text-primary"
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{link.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User info */}
      {!collapsed && user && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
              {user.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
