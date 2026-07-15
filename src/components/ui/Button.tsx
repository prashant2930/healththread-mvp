import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    let baseStyles = 'inline-flex items-center justify-center font-heading font-medium rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
    
    if (variant === 'primary') {
      baseStyles += ' text-white bg-sage-600 hover:bg-sage-700 shadow-soft hover:shadow-card';
    } else if (variant === 'secondary') {
      baseStyles += ' text-navy-700 bg-white border border-ivory-300 hover:border-sage-300 hover:bg-ivory-50 shadow-soft hover:shadow-card';
    } else if (variant === 'ghost') {
      baseStyles += ' text-navy-600 hover:bg-ivory-200 hover:text-navy-800';
    } else if (variant === 'danger') {
      baseStyles += ' text-white bg-red-500 hover:bg-red-600 shadow-soft';
    }

    let sizeStyles = '';
    if (size === 'sm') sizeStyles = 'px-3 py-1.5 text-sm';
    if (size === 'md') sizeStyles = 'px-4 py-2';
    if (size === 'lg') sizeStyles = 'px-6 py-3 text-lg font-semibold';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles} ${className}`}
        disabled={loading || disabled}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
