import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/uploadFile';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, FileText } from 'lucide-react';

interface Course {
  id: string;
  name: string;
}

interface Syllabus {
  id: string;
  course_id: string;
  title: string;
  file_url: string;
  content: string;
  courses?: { name: string }[];
}

const FacultySyllabus = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    course_id: '',
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchCourses();
    fetchSyllabi();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('id,name');
    setCourses(data || []);
  };

  const fetchSyllabi = async () => {
    const { data, error } = await supabase
      .from('syllabi')
      .select('id,course_id,title,file_url,content,courses(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setSyllabi((data as Syllabus[]) || []);
  };

  const handleAdd = async () => {
    if (!form.course_id || !form.title) {
      toast.error('Select course and enter title');
      return;
    }

    try {
      let fileUrl = '';

      if (file) {
        fileUrl = await uploadFile(file, 'syllabi');
      }

      const { error } = await supabase.from('syllabi').insert({
        course_id: form.course_id,
        title: form.title,
        content: form.content,
        file_url: fileUrl,
      });

      if (error) throw error;

      toast.success('Syllabus uploaded');
      setForm({ course_id: '', title: '', content: '' });
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      fetchSyllabi();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this syllabus?')) return;

    const { error } = await supabase.from('syllabi').delete().eq('id', id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Syllabus deleted');
    fetchSyllabi();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Syllabus</h1>

        <div className="bg-card p-5 rounded-xl card-shadow space-y-4">
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
            placeholder="Syllabus Title"
            className="w-full px-4 py-2 rounded-xl border bg-background"
          />

          <textarea
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            placeholder="Syllabus content or notes"
            className="w-full px-4 py-2 rounded-xl border bg-background"
            rows={3}
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
            {file ? file.name : 'Upload syllabus file'}
          </button>

          <button
            onClick={handleAdd}
            className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Save Syllabus
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {syllabi.map(item => (
            <div key={item.id} className="bg-card p-5 rounded-xl card-shadow">
              <FileText className="w-6 h-6 text-primary mb-2" />

              <h3 className="font-semibold">{item.title}</h3>

              <p className="text-sm text-muted-foreground">
                Course: {item.courses?.[0]?.name || 'Not assigned'}
              </p>

              {item.content && <p className="text-sm mt-2">{item.content}</p>}

              <div className="flex gap-4 mt-3">
                {item.file_url && (
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="text-primary text-sm"
                  >
                    Download
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
      </div>
    </DashboardLayout>
  );
};

export default FacultySyllabus;