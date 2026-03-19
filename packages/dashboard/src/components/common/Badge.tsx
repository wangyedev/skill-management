import { SkillScope } from '../../api/client';

interface BadgeProps {
  scope: SkillScope;
}

const scopeColors: Record<SkillScope, string> = {
  user: 'bg-blue-100 text-blue-800 border-blue-200',
  plugin: 'bg-purple-100 text-purple-800 border-purple-200',
  project: 'bg-green-100 text-green-800 border-green-200',
};

export function Badge({ scope }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${scopeColors[scope]}`}>
      {scope}
    </span>
  );
}
