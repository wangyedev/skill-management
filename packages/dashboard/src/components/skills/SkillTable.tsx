import { useState } from 'react';
import { Skill } from '../../api/client';
import { SkillRow } from './SkillRow';
import { EmptyState } from '../common/EmptyState';

interface SkillTableProps {
  skills: Skill[];
  total: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

type SortField = 'name' | 'client' | 'scope' | 'plugin' | 'version';
type SortOrder = 'asc' | 'desc';

export function SkillTable({ skills, total, selectedId, onSelect }: SkillTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedSkills = [...skills].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    const comparison = aValue.toString().localeCompare(bValue.toString());
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 ml-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (skills.length === 0) {
    return <EmptyState message="No skills found" />;
  }

  return (
    <div className="bg-white overflow-hidden flex flex-col h-full">
      <div className="px-6 py-3 border-b border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-600">
          Showing <span className="font-medium">{skills.length}</span> of{' '}
          <span className="font-medium">{total}</span> skills
        </p>
      </div>
      <div className="overflow-auto flex-1">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name
                  <SortIcon field="name" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('client')}
              >
                <div className="flex items-center">
                  Client
                  <SortIcon field="client" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('scope')}
              >
                <div className="flex items-center">
                  Scope
                  <SortIcon field="scope" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('plugin')}
              >
                <div className="flex items-center">
                  Plugin
                  <SortIcon field="plugin" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('version')}
              >
                <div className="flex items-center">
                  Version
                  <SortIcon field="version" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedSkills.map((skill) => (
              <SkillRow
                key={skill.id}
                skill={skill}
                isSelected={skill.id === selectedId}
                onClick={() => onSelect(skill.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
