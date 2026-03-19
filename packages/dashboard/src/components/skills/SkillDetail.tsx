import { SkillDetail as SkillDetailType } from '../../api/client';
import { Badge } from '../common/Badge';
import { MarkdownRenderer } from '../common/MarkdownRenderer';

interface SkillDetailProps {
  skill: SkillDetailType;
  onClose: () => void;
  onDelete: () => void;
}

export function SkillDetail({ skill, onClose, onDelete }: SkillDetailProps) {
  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Skill Details</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-900">{skill.name}</h3>
            <Badge scope={skill.scope} />
          </div>
          <p className="text-sm text-slate-600 mb-4">{skill.description}</p>

          <dl className="grid grid-cols-1 gap-3 text-sm">
            <div>
              <dt className="font-medium text-slate-700">Client</dt>
              <dd className="text-slate-600">{skill.client}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">Path</dt>
              <dd className="text-slate-600 break-all">{skill.path}</dd>
            </div>
            {skill.plugin && (
              <div>
                <dt className="font-medium text-slate-700">Plugin</dt>
                <dd className="text-slate-600">{skill.plugin}</dd>
              </div>
            )}
            {skill.version && (
              <div>
                <dt className="font-medium text-slate-700">Version</dt>
                <dd className="text-slate-600">{skill.version}</dd>
              </div>
            )}
            {skill.marketplace && (
              <div>
                <dt className="font-medium text-slate-700">Marketplace</dt>
                <dd className="text-slate-600">{skill.marketplace}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-4">Content</h4>
          <MarkdownRenderer content={skill.content} />
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-200">
        <button
          onClick={onDelete}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Skill
        </button>
      </div>
    </div>
  );
}
