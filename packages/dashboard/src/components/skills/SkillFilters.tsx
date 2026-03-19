import { SkillScope } from '../../api/client';

interface SkillFiltersProps {
  clients: string[];
  selectedClient: string;
  selectedScope: SkillScope | '';
  deduplicate: boolean;
  onChange: (filters: {
    client: string;
    scope: SkillScope | '';
    deduplicate: boolean;
  }) => void;
}

const scopes: Array<{ value: SkillScope | ''; label: string }> = [
  { value: '', label: 'All Scopes' },
  { value: 'user', label: 'User' },
  { value: 'plugin', label: 'Plugin' },
  { value: 'project', label: 'Project' },
];

export function SkillFilters({
  clients,
  selectedClient,
  selectedScope,
  deduplicate,
  onChange,
}: SkillFiltersProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 border-b border-slate-200">
      <div className="flex items-center gap-2">
        <label htmlFor="client-filter" className="text-sm font-medium text-slate-700">
          Client:
        </label>
        <select
          id="client-filter"
          value={selectedClient}
          onChange={(e) =>
            onChange({
              client: e.target.value,
              scope: selectedScope,
              deduplicate,
            })
          }
          className="px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Clients</option>
          {clients.map((client) => (
            <option key={client} value={client}>
              {client}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="scope-filter" className="text-sm font-medium text-slate-700">
          Scope:
        </label>
        <select
          id="scope-filter"
          value={selectedScope}
          onChange={(e) =>
            onChange({
              client: selectedClient,
              scope: e.target.value as SkillScope | '',
              deduplicate,
            })
          }
          className="px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {scopes.map((scope) => (
            <option key={scope.value} value={scope.value}>
              {scope.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="deduplicate-filter"
          checked={deduplicate}
          onChange={(e) =>
            onChange({
              client: selectedClient,
              scope: selectedScope,
              deduplicate: e.target.checked,
            })
          }
          className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="deduplicate-filter" className="text-sm font-medium text-slate-700">
          Deduplicate
        </label>
      </div>
    </div>
  );
}
