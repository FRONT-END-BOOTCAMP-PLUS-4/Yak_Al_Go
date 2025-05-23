// @lib/react-query/useQuestions.ts
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchQuestions = async ({ pageParam = 1 }) => {
  const response = await fetch(`/api/questions?page=${pageParam}&limit=10`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useQuestions = () => {
  return useInfiniteQuery({
    queryKey: ['questions'],
    queryFn: ({ pageParam = 1 }) => fetchQuestions({ pageParam }),
    getNextPageParam: (lastPage: any) => {
      // Check if there are questions in the response and if there are more pages
      if (!lastPage?.questions?.length || !lastPage.hasMore) {
        return undefined;
      }
      return lastPage.nextPage;
    },
    initialPageParam: 1,
  });
};
