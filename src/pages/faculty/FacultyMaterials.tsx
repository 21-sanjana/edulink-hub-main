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

interface Material {
  id: string;
  course_id: string;
  title: string;
  type: string;
  file_url: string;
  description?: string;
  courses?: { name: string }[];
}

const FacultyMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    course_id: '',
    title: '',
    type: 'PDF',
    description: '',
  });

  useEffect(() => {
    fetchCourses();
    fetchMaterials();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('id,name');
    setCourses(data || []);
  };

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('id,course_id,title,type,file_url,description,courses(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setMaterials((data as Material[]) || []);
  };

  const resetForm = () => {
    setForm({ course_id: '', title: '', type: 'PDF', description: '' });
    setFile(null);
    setShowForm(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!form.course_id || !form.title || !file) {
      toast.error('Select course, enter title and upload file');
      return;
    }

    try {
      setLoading(true);

      const fileUrl = await uploadFile(file, 'materials');

      const { error } = await supabase.from('materials').insert({
        course_id: form.course_id,
        title: form.title,
        type: form.type,
        description: form.description,
        file_url: fileUrl,
      });

      if (error) throw error;

      toast.success('Material uploaded');
      resetForm();
      fetchMaterials();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this material?')) return;

    const { error } = await supabase.from('materials').delete().eq('id', id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Material deleted');
    fetchMaterials();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Materials</h1>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Upload Material
          </button>
        </div>

        {showForm && (
          <div className="bg-card p-5 rounded-xl card-shadow space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">Upload Material</h3>
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
              placeholder="Material Title"
              className="w-full px-4 py-2 rounded-xl border bg-background"
            />

            <input
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              placeholder="Type PDF / PPT / DOC"
              className="w-full px-4 py-2 rounded-xl border bg-background"
            />

            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
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
              {file ? file.name : 'Choose file'}
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground"
            >
              {loading ? 'Uploading...' : 'Save Material'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map(material => (
            <div key={material.id} className="bg-card p-5 rounded-xl card-shadow">
              <FileText className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-semibold">{material.title}</h3>
              <p className="text-sm text-muted-foreground">
                Course: {material.courses?.[0]?.name || 'Not assigned'}
              </p>
              <p className="text-sm text-muted-foreground">Type: {material.type}</p>

              {material.description && (
                <p className="text-sm mt-2">{material.description}</p>
              )}

              <div className="flex gap-4 mt-3">
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="text-primary text-sm font-medium"
                >
                  Download
                </a>

                <button
                  onClick={() => handleDelete(material.id)}
                  className="text-destructive text-sm flex items-center gap-1"
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

export default FacultyMaterials;