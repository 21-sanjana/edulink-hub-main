import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface Course {
  id: string;
  name: string;
}

interface Score {
  id: string;
  course_id: string | null;
  student_id?: string | null;
  usn?: string;
  student_name: string;
  ia1: number;
  ia2: number;
  cia1: number;
  cia2: number;
  cia3: number;
  courses?: { name: string }[];
}

const FacultyPerformance = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [form, setForm] = useState({
    course_id: '',
    usn: '',
    student_name: '',
    ia1: 0,
    ia2: 0,
    cia1: 0,
    cia2: 0,
    cia3: 0,
  });

  useEffect(() => {
    fetchCourses();
    fetchScores();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('id,name')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setCourses(data || []);
  };

  const fetchScores = async () => {
    const { data, error } = await supabase
      .from('scores')
      .select(
        'id,course_id,student_id,usn,student_name,ia1,ia2,cia1,cia2,cia3,courses(name)'
      )
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setScores((data as Score[]) || []);
  };

  const handleAdd = async () => {
    if (!form.course_id || !form.usn || !form.student_name) {
      toast.error('Select course, enter USN and student name');
      return;
    }

    const payload = {
      course_id: form.course_id,
      student_id: null,
      usn: form.usn,
      student_name: form.student_name,
      ia1: Number(form.ia1) || 0,
      ia2: Number(form.ia2) || 0,
      cia1: Number(form.cia1) || 0,
      cia2: Number(form.cia2) || 0,
      cia3: Number(form.cia3) || 0,
    };

    const { error } = await supabase.from('scores').insert(payload);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Score added');

    setForm({
      course_id: '',
      usn: '',
      student_name: '',
      ia1: 0,
      ia2: 0,
      cia1: 0,
      cia2: 0,
      cia3: 0,
    });

    fetchScores();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this score?')) return;

    const { error } = await supabase.from('scores').delete().eq('id', id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Score deleted');
    fetchScores();
  };

  const total = (s: Score) => s.ia1 + s.ia2 + s.cia1 + s.cia2 + s.cia3;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Performance</h1>

        <div className="bg-card p-5 rounded-xl card-shadow grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={form.course_id}
            onChange={e => setForm({ ...form, course_id: e.target.value })}
            className="px-4 py-2 rounded-xl border bg-background"
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>

          <input
            value={form.usn}
            onChange={e => setForm({ ...form, usn: e.target.value })}
            placeholder="USN e.g. u06de21s0101"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <input
            value={form.student_name}
            onChange={e => setForm({ ...form, student_name: e.target.value })}
            placeholder="Student Name"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          {(['ia1', 'ia2', 'cia1', 'cia2', 'cia3'] as const).map(field => (
            <input
              key={field}
              type="number"
              value={form[field]}
              onChange={e =>
                setForm({ ...form, [field]: Number(e.target.value) })
              }
              placeholder={field.toUpperCase()}
              className="px-4 py-2 rounded-xl border bg-background"
            />
          ))}

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Add Score
          </button>
        </div>

        <div className="space-y-3">
          {scores.map(score => (
            <div
              key={score.id}
              className="bg-card p-4 rounded-xl card-shadow flex justify-between"
            >
              <div>
                <h3 className="font-semibold">{score.student_name}</h3>

                <p className="text-sm text-muted-foreground">
                  USN: {score.usn || 'Not assigned'}
                </p>

                <p className="text-sm text-muted-foreground">
                  Course: {score.courses?.[0]?.name || 'Not assigned'}
                </p>

                <p className="text-sm text-muted-foreground">
                  IA1: {score.ia1} | IA2: {score.ia2} | CIA1: {score.cia1} |
                  CIA2: {score.cia2} | CIA3: {score.cia3}
                </p>

                <p className="text-sm font-medium">Total: {total(score)}</p>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(score.id)}
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

export default FacultyPerformance;