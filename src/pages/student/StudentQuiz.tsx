import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Quiz {
  id: string;
  title: string;
  level: string;
  questions: { id: number; question: string }[];
  courses?: { name: string }[];
}

const StudentQuiz = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('id,title,level,questions,courses(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setQuizzes((data as Quiz[]) || []);
  };

  const submitQuiz = async (quiz: Quiz) => {
    const { error } = await supabase.from('quiz_results').insert({
      quiz_id: quiz.id,
      student_id: user?.id || '',
      student_name: user?.name || 'Student',
      score: quiz.questions.length,
      total: quiz.questions.length,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Quiz submitted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Quiz</h1>

        <div className="space-y-4">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="bg-card rounded-xl p-5 card-shadow">
              <h3 className="font-semibold">{quiz.title}</h3>
              <p className="text-sm text-muted-foreground">
                Course: {quiz.courses?.[0]?.name || 'Not assigned'}
              </p>
              <p className="text-sm text-muted-foreground">Level: {quiz.level}</p>

              <div className="mt-3 space-y-2">
                {quiz.questions?.map(q => (
                  <p key={q.id} className="text-sm">
                    {q.id}. {q.question}
                  </p>
                ))}
              </div>

              <button
                onClick={() => submitQuiz(quiz)}
                className="mt-4 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm"
              >
                Submit Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentQuiz;