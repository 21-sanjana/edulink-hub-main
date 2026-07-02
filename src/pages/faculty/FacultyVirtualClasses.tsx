import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Trash2, Video } from 'lucide-react';

interface Course {
  id: string;
  name: string;
}

interface VirtualClass {
  id: string;
  course_id: string;
  title: string;
  meeting_link: string;
  platform: string;
  scheduled_at: string;
  courses?: { name: string }[];
}

const FacultyVirtualClasses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<VirtualClass[]>([]);

  const [form, setForm] = useState({
    course_id: '',
    title: '',
    meeting_link: '',
    platform: 'Google Meet',
    scheduled_at: '',
  });

  useEffect(() => {
    fetchCourses();
    fetchClasses();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('id,name');
    setCourses(data || []);
  };

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('virtual_classes')
      .select('id,course_id,title,meeting_link,platform,scheduled_at,courses(name)')
      .order('scheduled_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setClasses((data as VirtualClass[]) || []);
  };

  const handleAdd = async () => {
    if (!form.course_id || !form.title || !form.meeting_link) {
      toast.error('Fill course, title and meeting link');
      return;
    }

    const { error } = await supabase.from('virtual_classes').insert({
      course_id: form.course_id,
      title: form.title,
      meeting_link: form.meeting_link,
      platform: form.platform,
      scheduled_at: form.scheduled_at || null,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Virtual class added');
    setForm({
      course_id: '',
      title: '',
      meeting_link: '',
      platform: 'Google Meet',
      scheduled_at: '',
    });
    fetchClasses();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this virtual class?')) return;

    const { error } = await supabase
      .from('virtual_classes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Virtual class deleted');
    fetchClasses();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Virtual Classes</h1>

        <div className="bg-card p-5 rounded-xl card-shadow grid grid-cols-1 md:grid-cols-2 gap-4">
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
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Class Title"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <input
            value={form.meeting_link}
            onChange={e => setForm({ ...form, meeting_link: e.target.value })}
            placeholder="Meeting Link"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <input
            value={form.platform}
            onChange={e => setForm({ ...form, platform: e.target.value })}
            placeholder="Platform"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <input
            type="datetime-local"
            value={form.scheduled_at}
            onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Add Class
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map(item => (
            <div key={item.id} className="bg-card p-5 rounded-xl card-shadow">
              <Video className="w-6 h-6 text-primary mb-2" />

              <h3 className="font-semibold">{item.title}</h3>

              <p className="text-sm text-muted-foreground">
                Course: {item.courses?.[0]?.name || 'Not assigned'}
              </p>

              <p className="text-sm text-muted-foreground">
                Platform: {item.platform}
              </p>

              {item.scheduled_at && (
                <p className="text-sm text-muted-foreground">
                  Time: {new Date(item.scheduled_at).toLocaleString()}
                </p>
              )}

              <div className="flex gap-4 mt-3">
                <a
                  href={item.meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary text-sm"
                >
                  Open Link
                </a>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-destructive text-sm flex gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyVirtualClasses;