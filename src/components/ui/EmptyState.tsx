import { type ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-ivory-200 flex items-center justify-center mb-4">
        <span className="text-navy-300" aria-hidden="true">
          {icon || <Inbox size={24} />}
        </span>
      </div>
      <h3 className="font-heading font-semibold text-navy-700 text-base mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-navy-400 max-w-xs mb-5">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} leftIcon={actionIcon}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
