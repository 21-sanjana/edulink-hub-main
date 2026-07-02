import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface Course {
  id: string;
  name: string;
}

interface Quiz {
  id: string;
  course_id: string;
  title: string;
  level: string;
  questions: any[];
  courses?: { name: string }[];
}

const FacultyQuiz = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const [form, setForm] = useState({
    course_id: '',
    title: '',
    level: 'beginner',
    questionsText: '',
  });

  useEffect(() => {
    fetchCourses();
    fetchQuizzes();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('id,name');
    setCourses(data || []);
  };

  const fetchQuizzes = async () => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('id,course_id,title,level,questions,courses(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setQuizzes((data as Quiz[]) || []);
  };

  const handleAdd = async () => {
    if (!form.course_id || !form.title || !form.questionsText) {
      toast.error('Fill course, title and questions');
      return;
    }

    const questions = form.questionsText
      .split('\n')
      .filter(q => q.trim())
      .map((question, index) => ({
        id: index + 1,
        question,
      }));

    const { error } = await supabase.from('quizzes').insert({
      course_id: form.course_id,
      title: form.title,
      level: form.level,
      questions,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Quiz created');
    setForm({
      course_id: '',
      title: '',
      level: 'beginner',
      questionsText: '',
    });
    fetchQuizzes();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this quiz?')) return;

    const { error } = await supabase.from('quizzes').delete().eq('id', id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Quiz deleted');
    fetchQuizzes();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Quiz</h1>

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
            placeholder="Quiz Title"
            className="w-full px-4 py-2 rounded-xl border bg-background"
          />

          <select
            value={form.level}
            onChange={e => setForm({ ...form, level: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border bg-background"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <textarea
            value={form.questionsText}
            onChange={e =>
              setForm({ ...form, questionsText: e.target.value })
            }
            placeholder="Enter one question per line"
            rows={5}
            className="w-full px-4 py-2 rounded-xl border bg-background"
          />

          <button
            onClick={handleAdd}
            className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground flex gap-2 items-center"
          >
            <Plus className="w-4 h-4" />
            Create Quiz
          </button>
        </div>

        <div className="space-y-3">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="bg-card p-5 rounded-xl card-shadow">
              <h3 className="font-semibold">{quiz.title}</h3>

              <p className="text-sm text-muted-foreground">
                Course: {quiz.courses?.[0]?.name || 'Not assigned'}
              </p>

              <p className="text-sm text-muted-foreground">
                Level: {quiz.level}
              </p>

              <p className="text-sm text-muted-foreground">
                Questions: {quiz.questions?.length || 0}
              </p>

              <button
                onClick={() => handleDelete(quiz.id)}
                className="mt-3 text-destructive text-sm flex gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyQuiz;