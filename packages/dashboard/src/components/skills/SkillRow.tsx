import { Skill } from '../../api/client';
import { Badge } from '../common/Badge';

interface SkillRowProps {
  skill: Skill;
  isSelected: boolean;
  onClick: () => void;
}

export function SkillRow({ skill, isSelected, onClick }: SkillRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer hover:bg-slate-50 ${
        isSelected ? 'bg-blue-50' : ''
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
        {skill.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {skill.client}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <Badge scope={skill.scope} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {skill.plugin || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {skill.version || '-'}
      </td>
    </tr>
  );
}
