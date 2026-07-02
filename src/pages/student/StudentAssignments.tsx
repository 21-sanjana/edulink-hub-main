import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/uploadFile';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Upload, FileText, X } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  file_url: string;
  courses?: { name: string }[];
}

interface Submission {
  assignment_id: string;
}

const StudentAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select('id,title,description,due_date,file_url,courses(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setAssignments((data as Assignment[]) || []);
  };

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from('assignment_submissions')
      .select('assignment_id')
      .eq('student_id', user?.id || '');

    setSubmissions(data || []);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 20 * 1024 * 1024) {
      toast.error('File size must be under 20MB');
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async (assignmentId: string) => {
    if (!content.trim() && !file) {
      toast.error('Enter notes or upload file');
      return;
    }

    try {
      let fileUrl = '';

      if (file) {
        fileUrl = await uploadFile(file, 'submissions');
      }

      const { error } = await supabase.from('assignment_submissions').insert({
        assignment_id: assignmentId,
        student_id: user?.id || '',
        student_name: user?.name || 'Student',
        content,
        file_url: fileUrl,
        status: 'submitted',
      });

      if (error) throw error;

      toast.success('Assignment submitted');
      setSubmitting(null);
      setContent('');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      fetchSubmissions();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const cancel = () => {
    setSubmitting(null);
    setContent('');
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const isSubmitted = (id: string) =>
    submissions.some(sub => sub.assignment_id === id);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Assignments</h1>

        <div className="space-y-4">
          {assignments.map(item => (
            <div key={item.id} className="bg-card rounded-xl p-5 card-shadow">
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Course: {item.courses?.[0]?.name || 'Not assigned'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Due: {item.due_date}
                  </p>
                  <p className="text-sm mt-2">{item.description}</p>

                  {item.file_url && (
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="inline-block mt-3 text-primary text-sm font-medium"
                    >
                      Download Assignment
                    </a>
                  )}
                </div>

                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full h-fit ${
                    isSubmitted(item.id)
                      ? 'bg-success/10 text-success'
                      : 'bg-warning/10 text-warning'
                  }`}
                >
                  {isSubmitted(item.id) ? 'Submitted' : 'Pending'}
                </span>
              </div>

              {!isSubmitted(item.id) && (
                <div className="mt-4">
                  {submitting === item.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Submission notes"
                        rows={3}
                        className="w-full px-4 py-2 rounded-xl border bg-background"
                      />

                      <input
                        ref={fileRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {!file ? (
                        <button
                          onClick={() => fileRef.current?.click()}
                          className="w-full border-2 border-dashed rounded-xl p-4 flex justify-center gap-2"
                        >
                          <Upload className="w-5 h-5" />
                          Upload answer file
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl border">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="text-sm flex-1">{file.name}</span>
                          <button onClick={() => setFile(null)}>
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmit(item.id)}
                          className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground"
                        >
                          Submit
                        </button>

                        <button
                          onClick={cancel}
                          className="px-4 py-2 rounded-xl bg-muted"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSubmitting(item.id)}
                      className="text-primary text-sm font-medium"
                    >
                      Submit Assignment →
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignments;