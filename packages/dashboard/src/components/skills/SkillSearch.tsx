import { useState, useEffect } from 'react';

interface SkillSearchProps {
  onChange: (search: string) => void;
}

export function SkillSearch({ onChange }: SkillSearchProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onChange]);

  return (
    <div className="bg-white p-4 border-b border-slate-200">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search skills..."
          className="w-full px-4 py-2 pl-10 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}
