import { useQuery } from '@tanstack/react-query';

interface Tag {
  id: string;
  name: string;
}

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
