import { useQuery } from '@tanstack/react-query';
import { fetchSkills, FetchSkillsParams } from '../api/client';

export function useSkills(params?: FetchSkillsParams) {
  return useQuery({
    queryKey: ['skills', params],
    queryFn: () => fetchSkills(params),
  });
}
