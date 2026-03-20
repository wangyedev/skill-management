export type SkillScope = "user" | "plugin" | "project";

export interface Skill {
  id: string;
  name: string;
  description: string;
  client: string;
  scope: SkillScope;
  path: string;
  plugin?: string;
  version?: string;
  marketplace?: string;
  frontmatter: Record<string, unknown>;
}

export interface SkillDetail extends Skill {
  content: string;
  rawContent: string;
}

export interface DuplicateGroup {
  name: string;
  skills: Skill[];
  canonical: Skill;
}

export interface SkillLocation {
  path: string;
  scope: SkillScope;
}

export interface ClientConfig {
  label: string;
  locations: SkillLocation[];
  parser: string;
}

export interface SkillscanConfig {
  clients: Record<string, ClientConfig>;
}

export interface FetchSkillsParams {
  client?: string;
  scope?: SkillScope;
  search?: string;
  deduplicate?: boolean;
}

export interface FetchSkillsResponse {
  skills: Skill[];
  total: number;
  scannedAt: string;
}

export interface FetchConfigResponse {
  config: SkillscanConfig;
  configPath: string | null;
}

export interface FetchDuplicatesResponse {
  groups: DuplicateGroup[];
  total: number;
}

export interface DeleteSkillResponse {
  success: boolean;
}

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    let message = `HTTP error! status: ${response.status}`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {
      // use default message
    }
    throw new Error(message);
  }
  return response.json();
}

export async function fetchSkills(params?: FetchSkillsParams): Promise<FetchSkillsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.client) searchParams.set('client', params.client);
  if (params?.scope) searchParams.set('scope', params.scope);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.deduplicate !== undefined) searchParams.set('deduplicate', String(params.deduplicate));

  const url = `/api/skills${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return fetchJSON<FetchSkillsResponse>(url);
}

export async function fetchSkill(id: string): Promise<SkillDetail> {
  return fetchJSON<SkillDetail>(`/api/skills/${id}`);
}

export async function deleteSkill(id: string): Promise<DeleteSkillResponse> {
  return fetchJSON<DeleteSkillResponse>(`/api/skills/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchConfig(): Promise<FetchConfigResponse> {
  return fetchJSON<FetchConfigResponse>('/api/config');
}

export async function fetchDuplicates(): Promise<FetchDuplicatesResponse> {
  return fetchJSON<FetchDuplicatesResponse>('/api/duplicates');
}
