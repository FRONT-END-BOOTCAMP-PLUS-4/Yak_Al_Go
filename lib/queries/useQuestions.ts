// @lib/react-query/useQuestions.ts
import { useInfiniteQuery } from '@tanstack/react-query';

export const QUESTIONS_QUERY_KEY = ['questions'] as const;

const fetchQuestions = async ({ pageParam = 1 }) => {
  const response = await fetch(`/api/questions?page=${pageParam}&limit=10`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useQuestions = () => {
  return useInfiniteQuery({
    queryKey: QUESTIONS_QUERY_KEY,
    queryFn: ({ pageParam = 1 }) => fetchQuestions({ pageParam }),
    getNextPageParam: (lastPage: any) => {
      // Check if there are questions in the response and if there are more pages
      if (!lastPage?.questions?.length || !lastPage.hasMore) {
        return undefined;
      }
      return lastPage.nextPage;
    },
    initialPageParam: 1,
    // 30초마다 데이터를 자동으로 새로고침
    refetchInterval: 30000,
    // 브라우저 탭/창이 다시 활성화될 때 데이터 새로고침
    refetchOnWindowFocus: true,
    // 1분 동안은 캐시된 데이터를 신선한 것으로 간주
    staleTime: 60000,
  });
};
