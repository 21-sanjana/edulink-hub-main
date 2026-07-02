import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Score {
  id: string;
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

const StudentScores = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [usn, setUsn] = useState('');

  useEffect(() => {
    const savedUSN = localStorage.getItem('student_usn') || '';
    setUsn(savedUSN);

    if (savedUSN) {
      fetchScores(savedUSN);
    }
  }, []);

  const fetchScores = async (studentUSN: string) => {
    const { data, error } = await supabase
      .from('scores')
      .select(
        'id,student_id,usn,student_name,ia1,ia2,cia1,cia2,cia3,courses(name)'
      )
      .eq('usn', studentUSN)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setScores((data as Score[]) || []);
  };

  const handleSearch = () => {
    if (!usn.trim()) {
      toast.error('Enter your USN');
      return;
    }

    localStorage.setItem('student_usn', usn.trim());
    fetchScores(usn.trim());
  };

  const total = (s: Score) => s.ia1 + s.ia2 + s.cia1 + s.cia2 + s.cia3;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Scores</h1>

        <div className="bg-card p-5 rounded-xl card-shadow flex gap-3">
          <input
            value={usn}
            onChange={e => setUsn(e.target.value)}
            placeholder="Enter your USN e.g. 1SV23MCA001"
            className="flex-1 px-4 py-2 rounded-xl border bg-background"
          />

          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground"
          >
            View
          </button>
        </div>

        <div className="space-y-3">
          {scores.map(score => (
            <div key={score.id} className="bg-card rounded-xl p-5 card-shadow">
              <h3 className="font-semibold">
                {score.courses?.[0]?.name || 'Course'}
              </h3>

              <p className="text-sm text-muted-foreground">
                USN: {score.usn}
              </p>

              <p className="text-sm text-muted-foreground">
                Student: {score.student_name}
              </p>

              <p className="text-sm text-muted-foreground">
                IA1: {score.ia1} | IA2: {score.ia2}
              </p>

              <p className="text-sm text-muted-foreground">
                CIA1: {score.cia1} | CIA2: {score.cia2} | CIA3: {score.cia3}
              </p>

              <p className="text-sm font-medium mt-1">Total: {total(score)}</p>
            </div>
          ))}

          {scores.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No scores found. Enter the same USN used by faculty.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentScores;