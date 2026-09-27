import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PriorityLevel } from '../../types/triage';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  showIcon = true,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  switch (priority) {
    case 'urgent':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}
        >
          {showIcon && <AlertCircle size={13} className="shrink-0 text-rose-600 animate-pulse" />}
          URGENT
        </span>
      );
    case 'priority':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}
        >
          {showIcon && <AlertTriangle size={13} className="shrink-0 text-amber-600" />}
          PRIORITY
        </span>
      );
    case 'normal':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md font-medium bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}
        >
          {showIcon && <CheckCircle2 size={13} className="shrink-0 text-slate-500" />}
          Normal
        </span>
      );
  }
};
