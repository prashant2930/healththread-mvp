import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hover = false, children, ...props }, ref) => {
    const base = 'bg-white rounded-2xl border border-ivory-300 p-6';
    const shadow = 'shadow-soft';
    const hoverStyles = hover ? 'hover:shadow-card hover:border-sage-300 transition-all duration-200 cursor-pointer' : '';

    return (
      <div ref={ref} className={`${base} ${shadow} ${hoverStyles} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
