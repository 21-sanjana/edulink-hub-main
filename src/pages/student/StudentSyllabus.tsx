import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

interface Syllabus {
  id: string;
  title: string;
  content: string;
  file_url: string;
  courses?: { name: string }[];
}

const StudentSyllabus = () => {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);

  useEffect(() => {
    fetchSyllabi();
  }, []);

  const fetchSyllabi = async () => {
    const { data, error } = await supabase
      .from('syllabi')
      .select('id,title,content,file_url,courses(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setSyllabi((data as Syllabus[]) || []);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Syllabus</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {syllabi.map(item => (
            <div key={item.id} className="bg-card rounded-xl p-5 card-shadow">
              <FileText className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                Course: {item.courses?.[0]?.name || 'Not assigned'}
              </p>
              {item.content && <p className="text-sm mt-2">{item.content}</p>}

              {item.file_url && (
                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-block mt-3 text-primary text-sm font-medium"
                >
                  Download Syllabus
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentSyllabus;