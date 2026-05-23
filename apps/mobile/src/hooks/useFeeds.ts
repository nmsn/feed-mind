import { useQuery } from '@tanstack/react-query';
import { feedsApi } from '@feed-mind/api-client';

export function useFeeds() {
  return useQuery({
    queryKey: ['feeds'],
    queryFn: () => feedsApi.list(),
  });
}