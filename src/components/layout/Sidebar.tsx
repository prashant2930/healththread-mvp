import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  Pill,
  Activity,
  RefreshCw,
  FolderOpen,
  MessageCircle,
  Shield,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../features/auth/AuthContext';

export const NAVIGATION_ITEMS = [
  { name: 'Overview', path: '/app', icon: LayoutDashboard },
  { name: 'Family', path: '/app/family', icon: Users },
  { name: 'Timeline', path: '/app/timeline', icon: Clock },
  { name: 'Medications', path: '/app/medications', icon: Pill },
  { name: 'Vitals', path: '/app/vitals', icon: Activity },
  { name: 'Care Loops', path: '/app/care-loops', icon: RefreshCw },
  { name: 'Records', path: '/app/records', icon: FolderOpen },
  { name: 'Assistant', path: '/app/assistant', icon: MessageCircle },
  { name: 'Access History', path: '/app/access-history', icon: Shield },
];

interface SidebarProps {
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ onClose, className = '' }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className={`flex flex-col h-full bg-white border-r border-ivory-200 ${className}`}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-ivory-100">
        <Logo size="lg" />
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-navy-400 hover:text-navy-600 rounded-lg hover:bg-ivory-50 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            // Exact match for overview, prefix match for others
            const isActive = item.path === '/app' 
              ? location.pathname === '/app' 
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors
                  ${isActive 
                    ? 'bg-sage-100 text-sage-700' 
                    : 'text-navy-600 hover:bg-ivory-100 hover:text-navy-800'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-sage-600' : 'text-navy-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-ivory-100 space-y-1">
        <Link
          to="/app/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-navy-600 hover:bg-ivory-100 hover:text-navy-800 transition-colors"
        >
          <Settings className="w-5 h-5 text-navy-400" />
          Settings
        </Link>
        <button
          onClick={() => {
            logout();
            onClose?.();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-navy-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 text-navy-400" />
          Log out
        </button>
      </div>
    </div>
  );
}
