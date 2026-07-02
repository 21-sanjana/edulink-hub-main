import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import type { UserRole } from '@/context/AuthContext';
import { toast } from 'sonner';

const LoginPage = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [usn, setUsn] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill email and password');
      return;
    }

    if (!isLogin && !name) {
      toast.error('Please enter your name');
      return;
    }

    if (!isLogin && role === 'student' && !usn) {
      toast.error('Please enter your USN');
      return;
    }

    setLoading(true);

    let success = false;

    if (isLogin) {
      success = await login(email, password, role);
    } else {
      success = await signup(name, email, password, role, usn);
    }

    setLoading(false);

    if (!success) {
      toast.error('Invalid details or role mismatch');
      return;
    }

    toast.success(`Welcome! Redirecting to ${role} dashboard...`);

    navigate(role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 card-shadow-elevated">
            <GraduationCap className="w-9 h-9 text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-bold text-foreground">EduNexus</h1>

          <p className="text-muted-foreground mt-1">
            Academic ERP & Learning Platform
          </p>
        </div>

        <div className="bg-card rounded-2xl card-shadow-float p-8">
          <h2 className="text-xl font-semibold text-card-foreground mb-6">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>

          <div className="flex gap-2 mb-6">
            {(['faculty', 'student'] as UserRole[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                  role === r
                    ? 'gradient-primary text-primary-foreground card-shadow'
                    : 'bg-muted text-muted-foreground hover:bg-secondary'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="Enter your name"
                />
              </div>
            )}

            {!isLogin && role === 'student' && (
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                  USN
                </label>

                <input
                  type="text"
                  value={usn}
                  onChange={e => setUsn(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="Example: 1SV23MCA001"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow pr-10"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity card-shadow disabled:opacity-60"
            >
              {loading
                ? 'Please wait...'
                : isLogin
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;