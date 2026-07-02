import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'faculty' | 'student';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  usn?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    role: UserRole
  ) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    usn?: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (id: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('id,name,email,role,usn')
      .eq('id', id)
      .single();

    if (data) {
      const profile = data as User;
      setUser(profile);

      if (profile.usn) {
        localStorage.setItem('student_usn', profile.usn);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        await loadProfile(data.user.id);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          localStorage.removeItem('student_usn');
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return false;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id,name,email,role,usn')
      .eq('id', data.user.id)
      .eq('role', role)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      return false;
    }

    setUser(profile as User);

    if (profile.usn) {
      localStorage.setItem('student_usn', profile.usn);
    }

    return true;
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    usn?: string
  ): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      return false;
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      email,
      role,
      usn: role === 'student' ? usn || null : null,
    });

    if (profileError) {
      return false;
    }

    const profile: User = {
      id: data.user.id,
      name,
      email,
      role,
      usn: role === 'student' ? usn : undefined,
    };

    setUser(profile);

    if (profile.usn) {
      localStorage.setItem('student_usn', profile.usn);
    }

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('student_usn');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};