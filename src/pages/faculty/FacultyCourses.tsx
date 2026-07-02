import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData, Course } from '@/context/DataContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const FacultyCourses = () => {
  const { courses, setCourses } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    instructor: '',
    duration: '',
    description: '',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setCourses(data || []);
  };

  const resetForm = () => {
    setForm({ name: '', instructor: '', duration: '', description: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.instructor || !form.duration) {
      toast.error('Fill all required fields');
      return;
    }

    setLoading(true);

    if (editing) {
      const { error } = await supabase
        .from('courses')
        .update({
          name: form.name,
          instructor: form.instructor,
          duration: form.duration,
          description: form.description,
        })
        .eq('id', editing.id);

      setLoading(false);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Course updated');
    } else {
      const { error } = await supabase.from('courses').insert({
        name: form.name,
        instructor: form.instructor,
        duration: form.duration,
        description: form.description,
        progress: 0,
      });

      setLoading(false);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Course added');
    }

    resetForm();
    fetchCourses();
  };

  const handleEdit = (course: Course) => {
    setEditing(course);
    setForm({
      name: course.name,
      instructor: course.instructor,
      duration: course.duration,
      description: course.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Delete this course?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('courses').delete().eq('id', id);

    if (error) {
      toast.error(error.message);
      return;
    }

    setCourses(prev => prev.filter(c => c.id !== id));
    toast.success('Course deleted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Courses</h1>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Course
          </button>
        </div>

        {showForm && (
          <div className="bg-card rounded-xl p-6 card-shadow border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                {editing ? 'Edit Course' : 'New Course'}
              </h3>

              <button
                onClick={resetForm}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Course Name *"
                className="px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <input
                value={form.instructor}
                onChange={e =>
                  setForm({ ...form, instructor: e.target.value })
                }
                placeholder="Instructor *"
                className="px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <input
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                placeholder="Duration *"
                className="px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <input
                value={form.description}
                onChange={e =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Description"
                className="px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading
                    ? 'Saving...'
                    : editing
                    ? 'Update Course'
                    : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <div
              key={course.id}
              className="bg-card rounded-xl p-5 card-shadow hover:card-shadow-elevated transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-semibold text-card-foreground">
                  {course.name}
                </h3>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(course)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-1">
                👨‍🏫 {course.instructor}
              </p>

              <p className="text-sm text-muted-foreground">
                ⏱ {course.duration}
              </p>

              {course.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {course.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyCourses;