import { useState, useMemo } from 'react';
import { Layout } from './components/layout/Layout';
import { SkillFilters } from './components/skills/SkillFilters';
import { SkillSearch } from './components/skills/SkillSearch';
import { SkillTable } from './components/skills/SkillTable';
import { SkillDetail } from './components/skills/SkillDetail';
import { ConfigViewer } from './components/config/ConfigViewer';
import { ConfirmModal } from './components/common/ConfirmModal';
import { useSkills } from './hooks/useSkills';
import { useSkill } from './hooks/useSkill';
import { useDeleteSkill } from './hooks/useDeleteSkill';
import { SkillScope } from './api/client';

type Tab = 'skills' | 'config';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('skills');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedScope, setSelectedScope] = useState<SkillScope | ''>('');
  const [deduplicate, setDeduplicate] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: skillsData, isLoading, error } = useSkills({
    client: selectedClient || undefined,
    scope: selectedScope || undefined,
    search: search || undefined,
    deduplicate,
  });

  const { data: selectedSkill } = useSkill(selectedSkillId);
  const deleteMutation = useDeleteSkill();

  const availableClients = useMemo(() => {
    if (!skillsData) return [];
    const clients = new Set(skillsData.skills.map((s) => s.client));
    return Array.from(clients).sort();
  }, [skillsData]);

  const handleFilterChange = (filters: {
    client: string;
    scope: SkillScope | '';
    deduplicate: boolean;
  }) => {
    setSelectedClient(filters.client);
    setSelectedScope(filters.scope);
    setDeduplicate(filters.deduplicate);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSkillId) return;

    try {
      await deleteMutation.mutateAsync(selectedSkillId);
      setSelectedSkillId(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete skill:', error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="border-b border-slate-200 bg-white">
          <div className="flex">
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'skills'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'config'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Configuration
            </button>
          </div>
        </div>

        {activeTab === 'skills' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <SkillFilters
              clients={availableClients}
              selectedClient={selectedClient}
              selectedScope={selectedScope}
              deduplicate={deduplicate}
              onChange={handleFilterChange}
            />
            <SkillSearch onChange={setSearch} />

            <div className="flex-1 flex overflow-hidden">
              <div className={`flex-1 overflow-hidden ${selectedSkillId ? 'w-2/3' : 'w-full'}`}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-slate-600">Loading skills...</p>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-red-600">Error loading skills: {(error as Error).message}</p>
                  </div>
                ) : skillsData ? (
                  <SkillTable
                    skills={skillsData.skills}
                    total={skillsData.total}
                    selectedId={selectedSkillId}
                    onSelect={setSelectedSkillId}
                  />
                ) : null}
              </div>

              {selectedSkillId && selectedSkill && (
                <div className="w-1/3 overflow-hidden">
                  <SkillDetail
                    skill={selectedSkill}
                    onClose={() => setSelectedSkillId(null)}
                    onDelete={() => setShowDeleteModal(true)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="flex-1 overflow-auto">
            <ConfigViewer />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </Layout>
  );
}

export default App;
