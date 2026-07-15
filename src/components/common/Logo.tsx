import { HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'lg';
  className?: string;
  link?: boolean;
}

export function Logo({ size = 'sm', className = '', link = true }: LogoProps) {
  const iconSize = size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
  const textSize = size === 'lg' ? 'text-2xl' : 'text-xl';
  
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <HeartPulse className={`${iconSize} text-sage-600`} />
      <span className={`font-heading font-bold text-navy-800 tracking-tight ${textSize}`}>
        HealthThread
      </span>
    </div>
  );

  if (link) {
    return <Link to="/">{content}</Link>;
  }
  return content;
}
