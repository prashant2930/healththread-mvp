import { Menu } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { getInitials } from '../../utils';
import { Logo } from '../common/Logo';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  
  return (
    <header className="h-16 bg-white border-b border-ivory-200 flex items-center justify-between px-4 lg:px-8 z-10">
      {/* Mobile left side */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-navy-600 hover:bg-ivory-50 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Logo link={true} />
      </div>

      {/* Desktop left side */}
      <div className="hidden lg:block flex-1" />

      {/* Right side - User profile */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-700 font-heading font-bold border border-sage-200">
          {getInitials(user?.fullName || '')}
        </div>
      </div>
    </header>
  );
}
