import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface Course {
  id: string;
  name: string;
}

interface Timetable {
  id: string;
  course_id: string;
  day: string;
  time: string;
  subject: string;
  faculty_name: string;
  room: string;
  courses?: { name: string }[];
}

const FacultyTimetable = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [records, setRecords] = useState<Timetable[]>([]);

  const [form, setForm] = useState({
    course_id: '',
    day: '',
    time: '',
    subject: '',
    faculty_name: '',
    room: '',
  });

  useEffect(() => {
    fetchCourses();
    fetchTimetable();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('id,name');
    setCourses(data || []);
  };

  const fetchTimetable = async () => {
    const { data, error } = await supabase
      .from('timetables')
      .select('id,course_id,day,time,subject,faculty_name,room,courses(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setRecords((data as Timetable[]) || []);
  };

  const handleAdd = async () => {
    if (!form.course_id || !form.day || !form.time || !form.subject) {
      toast.error('Fill course, day, time and subject');
      return;
    }

    const { error } = await supabase.from('timetables').insert(form);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Timetable added');

    setForm({
      course_id: '',
      day: '',
      time: '',
      subject: '',
      faculty_name: '',
      room: '',
    });

    fetchTimetable();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete timetable entry?')) return;

    const { error } = await supabase.from('timetables').delete().eq('id', id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Deleted');
    fetchTimetable();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Timetable</h1>

        <div className="bg-card p-5 rounded-xl card-shadow grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <select
            value={form.day}
            onChange={e => setForm({ ...form, day: e.target.value })}
            className="px-4 py-2 rounded-xl border bg-background"
          >
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </select>

          <input
            value={form.time}
            onChange={e => setForm({ ...form, time: e.target.value })}
            placeholder="Time e.g. 10:00 AM"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <input
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
            placeholder="Subject"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <input
            value={form.faculty_name}
            onChange={e => setForm({ ...form, faculty_name: e.target.value })}
            placeholder="Faculty Name"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <input
            value={form.room}
            onChange={e => setForm({ ...form, room: e.target.value })}
            placeholder="Room / Lab"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <button
            onClick={handleAdd}
            className="flex justify-center items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Add Timetable
          </button>
        </div>

        <div className="space-y-3">
          {records.map(item => (
            <div
              key={item.id}
              className="bg-card p-5 rounded-xl card-shadow flex justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold">{item.subject}</h3>

                <p className="text-sm text-muted-foreground">
                  Course: {item.courses?.[0]?.name || 'Not assigned'}
                </p>

                <p className="text-sm text-muted-foreground">
                  {item.day} · {item.time}
                </p>

                <p className="text-sm text-muted-foreground">
                  Faculty: {item.faculty_name || 'Not assigned'} · Room:{' '}
                  {item.room || 'Not assigned'}
                </p>
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

export default FacultyTimetable;