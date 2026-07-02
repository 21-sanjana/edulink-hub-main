import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { Video } from 'lucide-react';
import { toast } from 'sonner';

interface VirtualClass {
  id: string;
  title: string;
  meeting_link: string;
  platform: string;
  scheduled_at: string;
  courses?: { name: string }[];
}

const StudentVirtualClasses = () => {
  const [classes, setClasses] = useState<VirtualClass[]>([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('virtual_classes')
      .select('id,title,meeting_link,platform,scheduled_at,courses(name)')
      .order('scheduled_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setClasses((data as VirtualClass[]) || []);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Virtual Classes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map(item => (
            <div key={item.id} className="bg-card rounded-xl p-5 card-shadow">
              <Video className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                Course: {item.courses?.[0]?.name || 'Not assigned'}
              </p>
              <p className="text-sm text-muted-foreground">Platform: {item.platform}</p>
              {item.scheduled_at && (
                <p className="text-sm text-muted-foreground">
                  Time: {new Date(item.scheduled_at).toLocaleString()}
                </p>
              )}

              <a
                href={item.meeting_link}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 text-primary text-sm font-medium"
              >
                Join Class
              </a>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentVirtualClasses;