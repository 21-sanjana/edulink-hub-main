import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/common/StatCard';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, ClipboardList, UserCheck, Video } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['hsl(160,60%,40%)', 'hsl(0,72%,55%)'];

const StudentDashboard = () => {
  const { user } = useAuth();
  const { courses, assignments, attendance, virtualClasses } = useData();

  const myAttendance = attendance.filter(a => a.studentId === user?.id);
  const present = myAttendance.filter(a => a.status === 'present').length;
  const total = myAttendance.length;
  const attendancePct = total > 0 ? Math.round((present / total) * 100) : 0;

  const pendingAssignments = assignments.filter(a => !a.submissions.some(s => s.studentId === user?.id)).length;

  const pieData = [{ name: 'Present', value: present }, { name: 'Absent', value: total - present }];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name}!</p>
        </div>

        <div className="rounded-2xl gradient-primary p-6 text-primary-foreground">
          <h2 className="text-xl font-bold">Hello, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="mt-1 opacity-90">Stay on top of your assignments and classes. You've got this!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Enrolled Courses" value={courses.length} icon={BookOpen} color="primary" />
          <StatCard title="Pending Assignments" value={pendingAssignments} icon={ClipboardList} color="warning" />
          <StatCard title="Attendance" value={`${attendancePct}%`} icon={UserCheck} color="success" />
          <StatCard title="Upcoming Classes" value={virtualClasses.length} icon={Video} color="accent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Attendance</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-2xl font-bold text-primary mt-2">{attendancePct}%</p>
          </div>

          <div className="bg-card rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Upcoming Classes</h3>
            <div className="space-y-3">
              {virtualClasses.slice(0, 3).map(vc => (
                <div key={vc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{vc.title}</p>
                    <p className="text-xs text-muted-foreground">{vc.date} at {vc.time}</p>
                  </div>
                  <a href={vc.meetingLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-medium hover:underline">Join</a>
                </div>
              ))}
              {virtualClasses.length === 0 && <p className="text-sm text-muted-foreground">No upcoming classes</p>}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
