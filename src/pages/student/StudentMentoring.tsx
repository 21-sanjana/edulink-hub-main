import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Mentor {
  id: string;
  student_id: string;
  student_name: string;
  mentor_name: string;
  notes: string;
  meeting_link: string;
}

const StudentMentor = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<Mentor[]>([]);

  useEffect(() => {
    fetchMentor();
  }, []);

  const fetchMentor = async () => {
    const { data, error } = await supabase
      .from('mentoring')
      .select('*')
      .or(`student_id.eq.${user?.id || ''},student_name.eq.${user?.name || ''}`)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setRecords(data || []);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Mentor</h1>

        <div className="space-y-3">
          {records.map(item => (
            <div key={item.id} className="bg-card p-5 rounded-xl card-shadow">
              <h3 className="font-semibold">Mentor: {item.mentor_name}</h3>

              <p className="text-sm text-muted-foreground">
                Student: {item.student_name}
              </p>

              {item.notes && <p className="text-sm mt-2">{item.notes}</p>}

              {item.meeting_link && (
                <a
                  href={item.meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-primary text-sm font-medium"
                >
                  Open Meeting Link
                </a>
              )}
            </div>
          ))}

          {records.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No mentor details assigned yet.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentMentor;