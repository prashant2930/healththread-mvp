import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 32, className = '', fullScreen = false }: LoadingSpinnerProps) {
  const containerClass = fullScreen 
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
    : `flex flex-col items-center justify-center p-8 ${className}`;

  return (
    <div className={containerClass}>
      <Loader2 
        className="animate-spin text-sage-500" 
        style={{ width: size, height: size }}
      />
    </div>
  );
}
