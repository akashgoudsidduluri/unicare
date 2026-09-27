import React, { useState, useRef, useEffect } from 'react';
import { Student } from '../../types/student';
import { StudentAvatar } from './StudentAvatar';
import { ChevronDown, Check } from 'lucide-react';

interface StudentSelectorDropdownProps {
  students: Student[];
  activeStudent: Student;
  onSelectStudent: (id: string) => void;
}

export const StudentSelectorDropdown: React.FC<StudentSelectorDropdownProps> = ({
  students,
  activeStudent,
  onSelectStudent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button: [ ML ] Maya Lin (STU-1042) ▾ */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title="Switch student profile for demo"
        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-2xs transition-all cursor-pointer select-none text-left"
      >
        <StudentAvatar
          gender={activeStudent.avatarGender}
          name={activeStudent.name}
          size="sm"
        />
        <div className="hidden sm:block text-left text-xs leading-tight">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <span>{activeStudent.name}</span>
            <span className="font-mono text-[10px] text-slate-500 font-normal">
              ({activeStudent.id})
            </span>
          </div>
          <div className="text-[10px] text-slate-500 max-w-[130px] truncate">
            {activeStudent.program}
          </div>
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-400 ml-0.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1.5 animate-fadeIn focus:outline-none"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Switch Demo Student
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
            {students.map((s) => {
              const isSelected = s.id === activeStudent.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelectStudent(s.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-brand-50/70 text-brand-950 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <StudentAvatar gender={s.avatarGender} name={s.name} size="sm" />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="truncate">{s.name}</span>
                        <span className="font-mono text-[10px] text-slate-400 font-normal">
                          {s.id}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {s.program} • Year {s.yearOfStudy}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check size={14} className="text-brand-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
