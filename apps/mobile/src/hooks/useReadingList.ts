import { useQuery } from '@tanstack/react-query';
import { readingApi } from '@feed-mind/api-client';

export function useReadingList() {
  return useQuery({
    queryKey: ['reading'],
    queryFn: () => readingApi.list(),
  });
}