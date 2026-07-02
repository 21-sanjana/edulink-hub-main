import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/uploadFile';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, FileText, X } from 'lucide-react';

interface Course {
  id: string;
  name: string;
}

interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  file_url: string;
  courses?: { name: string }[];
}

interface Submission {
  id: string;
  student_name: string;
  content: string;
  file_url: string;
  submitted_at: string;
  assignments?: { title: string }[];
}

const FacultyAssignments = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    course_id: '',
    title: '',
    description: '',
    due_date: '',
  });

  useEffect(() => {
    fetchCourses();
    fetchAssignments();
    fetchSubmissions();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('id,name');
    setCourses(data || []);
  };

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select('id,course_id,title,description,due_date,file_url,courses(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setAssignments((data as Assignment[]) || []);
  };

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('assignment_submissions')
      .select('id,student_name,content,file_url,submitted_at,assignments(title)')
      .order('submitted_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setSubmissions((data as Submission[]) || []);
  };

  const resetForm = () => {
    setForm({ course_id: '', title: '', description: '', due_date: '' });
    setFile(null);
    setShowForm(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async () => {
  if (!form.course_id || !form.title || !form.due_date) {
    toast.error('Select course, title and due date');
    return;
  }

  try {
    let fileUrl = '';

    if (file) {
      fileUrl = await uploadFile(file, 'assignments');
    }

    const { error } = await supabase.from('assignments').insert({
      course_id: form.course_id,
      title: form.title,
      description: form.description,
      due_date: form.due_date,
      file_url: fileUrl,
    });

    if (error) {
      toast.error(error.message);
      console.error(error);
      return;
    }

    toast.success('Assignment uploaded successfully');
    resetForm();
    fetchAssignments();
  } catch (error: any) {
    toast.error(error.message);
    console.error(error);
  }
};

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this assignment?')) return;

    const { error } = await supabase.from('assignments').delete().eq('id', id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Assignment deleted');
    fetchAssignments();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Assignments</h1>

          <button
            onClick={() => setShowForm(true)}
            className="flex gap-2 items-center px-4 py-2 rounded-xl gradient-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Add Assignment
          </button>
        </div>

        {showForm && (
          <div className="bg-card p-5 rounded-xl card-shadow space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">New Assignment</h3>
              <button onClick={resetForm}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <select
              value={form.course_id}
              onChange={e => setForm({ ...form, course_id: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border bg-background"
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
              placeholder="Assignment Title"
              className="w-full px-4 py-2 rounded-xl border bg-background"
            />

            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
              className="w-full px-4 py-2 rounded-xl border bg-background"
            />

            <input
              type="date"
              value={form.due_date}
              onChange={e => setForm({ ...form, due_date: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border bg-background"
            />

            <input
              ref={fileRef}
              type="file"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />

            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed rounded-xl p-4 flex justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              {file ? file.name : 'Upload assignment file'}
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground"
            >
              Save Assignment
            </button>
          </div>
        )}

        <h2 className="text-lg font-semibold">Uploaded Assignments</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map(item => (
            <div key={item.id} className="bg-card p-5 rounded-xl card-shadow">
              <FileText className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-semibold">{item.title}</h3>

              <p className="text-sm text-muted-foreground">
                Course: {item.courses?.[0]?.name || 'Not assigned'}
              </p>

              <p className="text-sm text-muted-foreground">
                Due: {item.due_date}
              </p>

              <p className="text-sm mt-2">{item.description}</p>

              <div className="flex gap-4 mt-3">
                {item.file_url && (
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="text-primary text-sm"
                  >
                    Download File
                  </a>
                )}

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

        <h2 className="text-lg font-semibold">Student Submissions</h2>

        <div className="space-y-3">
          {submissions.map(sub => (
            <div key={sub.id} className="bg-card p-4 rounded-xl card-shadow">
              <h3 className="font-semibold">
                {sub.assignments?.[0]?.title || 'Assignment'}
              </h3>

              <p className="text-sm text-muted-foreground">
                Student: {sub.student_name}
              </p>

              <p className="text-sm text-muted-foreground">
                Submitted: {new Date(sub.submitted_at).toLocaleString()}
              </p>

              {sub.content && <p className="text-sm mt-2">{sub.content}</p>}

              {sub.file_url && (
                <a
                  href={sub.file_url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-block mt-2 text-primary text-sm font-medium"
                >
                  Download Submission
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyAssignments;