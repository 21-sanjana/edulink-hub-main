import { useAuth } from '@/context/AuthContext';
import { Bell, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuToggle?: () => void;
}

export const Navbar = ({ onMenuToggle }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-lg font-semibold text-foreground capitalize">
          {user?.role === 'faculty' ? 'Faculty' : 'Student'} Portal
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-muted transition-colors">
          {dark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
        </button>

        <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              {user?.name[0]}
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-xl card-shadow-float py-2 z-50">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
