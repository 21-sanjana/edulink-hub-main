import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Attendance {
  id: string;
  student_id?: string | null;
  usn?: string;
  student_name: string;
  subject: string;
  date: string;
  status: string;
  courses?: { name: string }[];
}

const StudentAttendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<Attendance[]>([]);
  const [usn, setUsn] = useState('');

  useEffect(() => {
    const savedUSN = localStorage.getItem('student_usn') || '';
    setUsn(savedUSN);

    if (savedUSN) {
      fetchAttendance(savedUSN);
    }
  }, []);

  const fetchAttendance = async (studentUSN: string) => {
    const { data, error } = await supabase
      .from('attendance')
      .select('id,student_id,usn,student_name,subject,date,status,courses(name)')
      .eq('usn', studentUSN)
      .order('date', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setRecords((data as Attendance[]) || []);
  };

  const handleSearch = () => {
    if (!usn.trim()) {
      toast.error('Enter your USN');
      return;
    }

    localStorage.setItem('student_usn', usn.trim());
    fetchAttendance(usn.trim());
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Attendance</h1>

        <div className="bg-card p-5 rounded-xl card-shadow flex gap-3">
          <input
            value={usn}
            onChange={e => setUsn(e.target.value)}
            placeholder="Enter your USN e.g. 1SV23MCA001"
            className="flex-1 px-4 py-2 rounded-xl border bg-background"
          />

          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground"
          >
            View
          </button>
        </div>

        <div className="space-y-3">
          {records.map(record => (
            <div key={record.id} className="bg-card rounded-xl p-5 card-shadow">
              <h3 className="font-semibold">{record.subject}</h3>

              <p className="text-sm text-muted-foreground">
                USN: {record.usn}
              </p>

              <p className="text-sm text-muted-foreground">
                Course: {record.courses?.[0]?.name || 'Not assigned'}
              </p>

              <p className="text-sm text-muted-foreground">
                Date: {record.date}
              </p>

              <p className="text-sm">
                Status:{' '}
                <span
                  className={
                    record.status === 'present'
                      ? 'text-success font-medium'
                      : 'text-destructive font-medium'
                  }
                >
                  {record.status}
                </span>
              </p>
            </div>
          ))}

          {records.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No attendance found. Enter the same USN used by faculty.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;