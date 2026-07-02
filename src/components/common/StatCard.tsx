import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'primary' | 'accent' | 'success' | 'warning';
}

const colorMap = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

export const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }: StatCardProps) => (
  <div className="bg-card rounded-xl p-5 card-shadow hover:card-shadow-elevated transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold text-card-foreground mt-1">{value}</p>
        {trend && <p className="text-xs text-success mt-1">{trend}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);
