import { useQuery } from '@tanstack/react-query';
import { Tag } from '@/backend/domain/entities/TagEntity';

async function fetchTags(): Promise<Tag[]> {
  const response = await fetch('/api/tags');
  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }
  return response.json();
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });
}
