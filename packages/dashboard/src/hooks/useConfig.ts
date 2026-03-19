import { useQuery } from '@tanstack/react-query';
import { fetchConfig } from '../api/client';

export function useConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: fetchConfig,
  });
}
