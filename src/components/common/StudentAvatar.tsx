import React from 'react';
import { User, UserCheck, UserPlus, Sparkles } from 'lucide-react';
import { StudentAvatarGender } from '../../types/student';

interface StudentAvatarProps {
  gender?: StudentAvatarGender;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  gender = 'neutral',
  name,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  // Distinct but restrained professional colors for avatar badges
  const getStyle = () => {
    switch (gender) {
      case 'female':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: 'User',
        };
      case 'male':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: 'User',
        };
      case 'other':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          icon: 'UserCheck',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: 'User',
        };
    }
  };

  const style = getStyle();
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : null;

  return (
    <div
      title={name ? `${name} (${gender})` : 'Student'}
      className={`inline-flex items-center justify-center font-semibold rounded-full border shadow-xs select-none transition-colors ${style.bg} ${sizeClasses[size]} ${className}`}
    >
      {initials ? (
        <span>{initials}</span>
      ) : (
        <User size={iconSizes[size]} strokeWidth={2} />
      )}
    </div>
  );
};
