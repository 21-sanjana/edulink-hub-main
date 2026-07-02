import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  name: string;
  instructor: string;
  duration: string;
  description?: string;
}

const StudentCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Courses</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map(course => (
            <div key={course.id} className="bg-card rounded-xl p-5 card-shadow">
              <BookOpen className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold">{course.name}</h3>
              <p className="text-sm text-muted-foreground">Faculty: {course.instructor}</p>
              <p className="text-sm text-muted-foreground">Duration: {course.duration}</p>
              {course.description && <p className="text-sm mt-2">{course.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentCourses;