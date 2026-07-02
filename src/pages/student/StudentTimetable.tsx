import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Timetable {
  id: string;
  day: string;
  time: string;
  subject: string;
  faculty_name: string;
  room: string;
  courses?: { name: string }[];
}

const StudentTimetable = () => {
  const [records, setRecords] = useState<Timetable[]>([]);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    const { data, error } = await supabase
      .from('timetables')
      .select('id,day,time,subject,faculty_name,room,courses(name)')
      .order('day', { ascending: true });

    if (error) {
      toast.error(error.message);
      return;
    }

    setRecords((data as Timetable[]) || []);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Timetable</h1>

        <div className="space-y-3">
          {records.map(item => (
            <div key={item.id} className="bg-card p-5 rounded-xl card-shadow">
              <h3 className="font-semibold">{item.subject}</h3>

              <p className="text-sm text-muted-foreground">
                Course: {item.courses?.[0]?.name || 'Not assigned'}
              </p>

              <p className="text-sm text-muted-foreground">
                {item.day} · {item.time}
              </p>

              <p className="text-sm text-muted-foreground">
                Faculty: {item.faculty_name || 'Not assigned'}
              </p>

              <p className="text-sm text-muted-foreground">
                Room: {item.room || 'Not assigned'}
              </p>
            </div>
          ))}

          {records.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No timetable available yet.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentTimetable;