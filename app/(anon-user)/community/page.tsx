import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityCard } from '@/components/community/CommunityCard';
import { SearchAndWrite } from '@/components/community/SearchAndWrite';

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  answers: number;
};

// Mock data for community posts
const posts: Post[] = [
  {
    id: 4,
    title:
      '혈압약 부작용 경험 공유해주세요. 혈압약 부작용 경험 공유해주세요. 혈압약 부작용 경험 공유해주세요. 혈압약 부작용 경험 공유해주세요. 혈압약 부작용 경험 공유해주세요. ',
    content:
      '최근 혈압약을 처방받았는데 부작용이 있으신 분들 경험 공유 부탁드립니다. 최근 혈압약을 처방받았는데 부작용이 있으신 분들 경험 공유 부탁드립니다. 최근 혈압약을 처방받았는데 부작용이 있으신 분들 경험 공유 부탁드립니다. 최근 혈압약을 처방받았는데 부작용이 있으신 분들 경험 공유 부탁드립니다.',
    author: 'user4',
    date: '2023-05-03',
    tags: ['혈압약', '부작용'],
    answers: 5,
  },
  {
    id: 5,
    title: '비타민 추천 부탁드립니다.',
    content: '요즘 피로감이 심한데 어떤 비타민이 좋을까요?',
    author: 'user5',
    date: '2023-05-01',
    tags: ['비타민', '영양제'],
    answers: 4,
  },
  {
    id: 6,
    title: '두통약 추천해주세요.',
    content: '만성 두통이 있는데 효과 좋은 두통약 추천 부탁드립니다.',
    author: 'user6',
    date: '2023-04-28',
    tags: ['두통', '진통제'],
    answers: 3,
  },
];

const qnas: Post[] = [
  {
    id: 1,
    title: '타이레놀과 아스피린을 함께 복용해도 될까요?',
    content: '두통이 심해서 타이레놀과 아스피린을 함께 복용해도 괜찮을지 궁금합니다.',
    author: 'user1',
    date: '2023-05-10',
    tags: ['진통제', '복용법'],
    answers: 2,
  },
  {
    id: 2,
    title: '소아 감기약 추천 부탁드립니다.',
    content: '5세 아이가 감기에 걸렸는데 어떤 약을 먹이면 좋을까요?',
    author: 'user2',
    date: '2023-05-08',
    tags: ['소아', '감기약'],
    answers: 3,
  },
  {
    id: 3,
    title: '항생제 복용 후 유산균 섭취 시간',
    content: '항생제 복용 후 유산균은 얼마나 시간을 두고 먹어야 효과적인가요?',
    author: 'user3',
    date: '2023-05-05',
    tags: ['항생제', '유산균'],
    answers: 1,
  },
];

export default function CommunityPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">커뮤니티</h1>
          <p className="text-muted-foreground">약에 관한 정보를 공유하고 소통하는 공간입니다.</p>
        </div>

        <SearchAndWrite />

        <Tabs defaultValue="expert" className="w-full">
          <TabsList>
            <TabsTrigger value="expert">전문가 Q&A</TabsTrigger>
            <TabsTrigger value="community">자유게시판</TabsTrigger>
          </TabsList>
          <TabsContent value="expert" className="mt-4">
            <div className="grid gap-4">
              {qnas.map((qna) => (
                <CommunityCard key={qna.id} post={qna} isQna={true} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="community" className="mt-4">
            <div className="grid gap-4">
              {posts.map((post) => (
                <CommunityCard key={post.id} post={post} isQna={false} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
