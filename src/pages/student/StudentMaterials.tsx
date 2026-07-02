import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

interface Material {
  id: string;
  title: string;
  type: string;
  file_url: string;
  description?: string;
  courses?: { name: string }[];
}

const StudentMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('id,title,type,file_url,description,courses(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setMaterials((data as Material[]) || []);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Study Materials</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map(material => (
            <div key={material.id} className="bg-card rounded-xl p-5 card-shadow">
              <FileText className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold">{material.title}</h3>
              <p className="text-sm text-muted-foreground">
                Course: {material.courses?.[0]?.name || 'Not assigned'}
              </p>
              <p className="text-sm text-muted-foreground">Type: {material.type}</p>

              {material.description && <p className="text-sm mt-2">{material.description}</p>}

              {material.file_url && (
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-block mt-3 text-primary text-sm font-medium"
                >
                  Download Material
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentMaterials;