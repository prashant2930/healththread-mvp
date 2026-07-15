import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'sage' | 'ocean' | 'peach' | 'lavender' | 'navy' | 'gray';
}

export function Badge({ variant = 'sage', className = '', children, ...props }: BadgeProps) {
  let colorStyles = '';
  switch (variant) {
    case 'sage': colorStyles = 'bg-sage-100 text-sage-700'; break;
    case 'ocean': colorStyles = 'bg-ocean-100 text-ocean-700'; break;
    case 'peach': colorStyles = 'bg-peach-100 text-peach-700'; break;
    case 'lavender': colorStyles = 'bg-lavender-100 text-lavender-700'; break;
    case 'navy': colorStyles = 'bg-navy-100 text-navy-700'; break;
    case 'gray': colorStyles = 'bg-gray-100 text-gray-700'; break;
  }

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${colorStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
