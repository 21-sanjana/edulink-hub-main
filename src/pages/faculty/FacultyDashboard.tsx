import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/common/StatCard';
import { useData } from '@/context/DataContext';
import { Users, BookOpen, ClipboardList, Video, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(160,60%,40%)', 'hsl(200,80%,50%)', 'hsl(38,92%,55%)', 'hsl(0,72%,55%)'];

const FacultyDashboard = () => {
  const { courses, assignments, virtualClasses, attendance } = useData();

  const totalStudents = 45;
  const barData = courses.map(c => ({ name: c.name.split(' ')[0], students: Math.floor(Math.random() * 30) + 15 }));
  const pieData = [
    { name: 'Present', value: attendance.filter(a => a.status === 'present').length },
    { name: 'Absent', value: attendance.filter(a => a.status === 'absent').length },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Faculty Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
        </div>

        {/* Welcome banner */}
        <div className="rounded-2xl gradient-primary p-6 text-primary-foreground">
          <h2 className="text-xl font-bold">Welcome, Admin!</h2>
          <p className="mt-1 opacity-90">Manage your courses, track attendance, and monitor student performance all in one place.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Students" value={totalStudents} icon={Users} color="primary" />
          <StatCard title="Total Courses" value={courses.length} icon={BookOpen} color="accent" />
          <StatCard title="Assignments" value={assignments.length} icon={ClipboardList} color="warning" />
          <StatCard title="Virtual Classes" value={virtualClasses.length} icon={Video} color="success" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Students per Course</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="students" fill="hsl(160,60%,40%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl p-6 card-shadow">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Attendance Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-sm text-muted-foreground">{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
