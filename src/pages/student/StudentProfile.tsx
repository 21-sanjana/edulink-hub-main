import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { User, Mail, Phone } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>

        <div className="bg-card rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground">
              {user?.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-card-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-card-foreground mb-1.5 flex items-center gap-2"><User className="w-4 h-4" /> Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground mb-1.5 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</label>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground mb-1.5 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Enter phone number" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button type="submit" className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm">Save Changes</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
