import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface Mentor {
  id: string;
  student_id: string;
  student_name: string;
  mentor_name: string;
  notes: string;
  meeting_link: string;
}

const FacultyMentoring = () => {
  const [records, setRecords] = useState<Mentor[]>([]);
  const [form, setForm] = useState({
    student_id: '',
    student_name: '',
    mentor_name: '',
    notes: '',
    meeting_link: '',
  });

  useEffect(() => {
    fetchMentoring();
  }, []);

  const fetchMentoring = async () => {
    const { data, error } = await supabase
      .from('mentoring')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setRecords(data || []);
  };

  const handleAdd = async () => {
    if (!form.student_name || !form.mentor_name) {
      toast.error('Enter student and mentor name');
      return;
    }

    const { error } = await supabase.from('mentoring').insert(form);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Mentoring details added');

    setForm({
      student_id: '',
      student_name: '',
      mentor_name: '',
      notes: '',
      meeting_link: '',
    });

    fetchMentoring();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete mentoring record?')) return;

    const { error } = await supabase.from('mentoring').delete().eq('id', id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Deleted');
    fetchMentoring();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mentoring</h1>

        <div className="bg-card p-5 rounded-xl card-shadow grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.student_id}
            onChange={e => setForm({ ...form, student_id: e.target.value })}
            placeholder="Student ID / USN"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <input
            value={form.student_name}
            onChange={e => setForm({ ...form, student_name: e.target.value })}
            placeholder="Student Name"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <input
            value={form.mentor_name}
            onChange={e => setForm({ ...form, mentor_name: e.target.value })}
            placeholder="Mentor Name"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <input
            value={form.meeting_link}
            onChange={e => setForm({ ...form, meeting_link: e.target.value })}
            placeholder="Meeting Link"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <textarea
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="Mentor notes"
            className="md:col-span-2 px-4 py-2 rounded-xl border bg-background"
            rows={3}
          />

          <button
            onClick={handleAdd}
            className="flex justify-center items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Add Mentor Details
          </button>
        </div>

        <div className="space-y-3">
          {records.map(item => (
            <div
              key={item.id}
              className="bg-card p-5 rounded-xl card-shadow flex justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold">{item.student_name}</h3>

                <p className="text-sm text-muted-foreground">
                  Mentor: {item.mentor_name}
                </p>

                {item.student_id && (
                  <p className="text-sm text-muted-foreground">
                    ID/USN: {item.student_id}
                  </p>
                )}

                {item.notes && <p className="text-sm mt-2">{item.notes}</p>}

                {item.meeting_link && (
                  <a
                    href={item.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-primary text-sm font-medium"
                  >
                    Open Meeting Link
                  </a>
                )}
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-destructive"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyMentoring;