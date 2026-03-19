import { useQuery } from '@tanstack/react-query';
import { fetchSkill } from '../api/client';

export function useSkill(id: string | null) {
  return useQuery({
    queryKey: ['skill', id],
    queryFn: () => fetchSkill(id!),
    enabled: !!id,
  });
}
