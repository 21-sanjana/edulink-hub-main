import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface Course {
  id: string;
  name: string;
}

interface Attendance {
  id: string;
  course_id: string | null;
  student_id?: string | null;
  usn?: string;
  student_name: string;
  subject: string;
  date: string;
  status: string;
  courses?: { name: string }[];
}

const isValidUUID = (value: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
};

const FacultyAttendance = () => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [form, setForm] = useState({
    course_id: '',
    usn: '',
    student_name: '',
    subject: '',
    date: '',
    status: 'present',
  });

  useEffect(() => {
    fetchCourses();
    fetchAttendance();
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

  const fetchAttendance = async () => {
    const { data, error } = await supabase
      .from('attendance')
      .select(
        'id,course_id,student_id,usn,student_name,subject,date,status,courses(name)'
      )
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setRecords((data as Attendance[]) || []);
  };

  const handleAdd = async () => {
    if (!form.usn || !form.student_name || !form.subject || !form.date) {
      toast.error('Fill USN, student name, subject and date');
      return;
    }

    if (form.course_id && !isValidUUID(form.course_id)) {
      toast.error('Invalid course selected. Please select a course from dropdown.');
      return;
    }

    const payload = {
      course_id: form.course_id || null,
      student_id: null,
      usn: form.usn,
      student_name: form.student_name,
      subject: form.subject,
      date: form.date,
      status: form.status,
    };

    const { error } = await supabase.from('attendance').insert(payload);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Attendance added');

    setForm({
      course_id: '',
      usn: '',
      student_name: '',
      subject: '',
      date: '',
      status: 'present',
    });

    fetchAttendance();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this attendance record?')) return;

    const { error } = await supabase.from('attendance').delete().eq('id', id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Attendance deleted');
    fetchAttendance();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Attendance</h1>

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

          <input
            value={form.usn}
            onChange={e => setForm({ ...form, usn: e.target.value })}
            placeholder="USN e.g. 1SV23MCA001"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <input
            value={form.student_name}
            onChange={e => setForm({ ...form, student_name: e.target.value })}
            placeholder="Student Name"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <input
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
            placeholder="Subject"
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="px-4 py-2 rounded-xl border bg-background"
          />

          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            className="px-4 py-2 rounded-xl border bg-background"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Add Attendance
          </button>
        </div>

        <div className="space-y-3">
          {records.map(record => (
            <div
              key={record.id}
              className="bg-card p-4 rounded-xl card-shadow flex justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold">{record.student_name}</h3>

                <p className="text-sm text-muted-foreground">
                  USN: {record.usn || 'Not assigned'}
                </p>

                <p className="text-sm text-muted-foreground">
                  Course: {record.courses?.[0]?.name || 'Not assigned'}
                </p>

                <p className="text-sm text-muted-foreground">
                  Subject: {record.subject} · Date: {record.date}
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

              <button
                type="button"
                onClick={() => handleDelete(record.id)}
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

export default FacultyAttendance;