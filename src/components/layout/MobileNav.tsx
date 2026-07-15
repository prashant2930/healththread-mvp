import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  Pill,
  Menu
} from 'lucide-react';

interface MobileNavProps {
  onMoreClick: () => void;
}

const MOBILE_ITEMS = [
  { name: 'Overview', path: '/app', icon: LayoutDashboard },
  { name: 'Family', path: '/app/family', icon: Users },
  { name: 'Timeline', path: '/app/timeline', icon: Clock },
  { name: 'Meds', path: '/app/medications', icon: Pill },
];

export function MobileNav({ onMoreClick }: MobileNavProps) {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-ivory-200 pb-safe z-40 lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {MOBILE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/app' 
            ? location.pathname === '/app' 
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors
                ${isActive ? 'text-sage-600' : 'text-navy-400 hover:text-navy-600'}
              `}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-sage-100' : ''}`} />
              <span className="text-[10px] font-medium leading-none">{item.name}</span>
            </Link>
          );
        })}
        
        <button
          onClick={onMoreClick}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-navy-400 hover:text-navy-600 transition-colors"
        >
          <Menu className="w-6 h-6" />
          <span className="text-[10px] font-medium leading-none">More</span>
        </button>
      </div>
    </div>
  );
}
