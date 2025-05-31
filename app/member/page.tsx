'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pill, MessageSquare, User, Store } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface Medicine {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  active: boolean;
  item_seq: string;
}

interface Post {
  id: number;
  title: string;
  date: string;
  answers: number;
  type: 'expert' | 'community';
}

interface Health {
  id: number;
  healthId: number;
  healthName: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [pharmacyInfo, setPharmacyInfo] = useState({
    name: '',
    address: '',
  });
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showDeleteMedicineDialog, setShowDeleteMedicineDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [medicineQuery, setMedicineQuery] = useState('');
  const [selectedItemSeq, setSelectedItemSeq] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState<
    {
      item_seq: string;
      item_name: string;
      entp_name: string;
    }[]
  >([]);
  const [selectedMedicine, setSelectedMedicine] = useState<{
    item_seq: string;
    item_name: string;
    entp_name: string;
  } | null>(null);
  const [healths, setHealths] = useState<Health[]>([]);

  const { data: session } = useSession();
  const name = session?.user?.name ?? '';
  const email = session?.user?.email ?? '';
  const hpid = session?.user?.hpid ?? '';
  const id = session?.user?.id ?? '';
  const image = session?.user?.image ?? '';
  const member_type = session?.user?.member_type ?? '';
  const photo = session?.user?.photo ?? '';

  useEffect(() => {
    const fetchPharmacyInfo = async () => {
      if (member_type === 1 && hpid) {
        try {
          const response = await fetch(`/api/mypage/phamacy?hpid=${hpid}`);
          if (response.ok) {
            const data = await response.json();
            setPharmacyInfo(data);
          }
        } catch (error) {
          console.error('Failed to fetch pharmacy info:', error);
        }
      }
    };

    fetchPharmacyInfo();
  }, [hpid, member_type]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      // fetch medicines
      try {
        const medRes = await fetch(`/api/mypage/medicine?userId=${id}`);
        if (medRes.ok) {
          const medData = await medRes.json();
          setMedicines(medData);
        }
      } catch (error) {
        console.error('Failed to fetch medicines:', error);
      }

      // fetch posts
      try {
        const postRes = await fetch(`/api/mypage/post?userId=${id}`);
        if (postRes.ok) {
          const postData = await postRes.json();
          setPosts([...(postData.qnas || []), ...(postData.posts || [])]);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }

      // fetch health data
      try {
        const healthRes = await fetch(`/api/mypage/health?userId=${id}`);
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setHealths(healthData);
        }
      } catch (error) {
        console.error('Failed to fetch healths:', error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    async function loadMedicines() {
      try {
        const res = await fetch(`/api/mypage/medicinedb?query=${medicineQuery}`);
        if (res.ok) {
          const data = await res.json();
          setFilteredMedicines(data);
        }
      } catch (error) {
        console.error('Failed to load medicines:', error);
        setFilteredMedicines([]);
      }
    }

    if (medicineQuery.length >= 2) {
      loadMedicines();
    } else {
      setFilteredMedicines([]);
    }
  }, [medicineQuery]);

  // page.tsx에 핸들러 함수 추가
  const handleDeleteMedicine = (id: number) => {
    setMedicineToDelete(id);
    setShowDeleteMedicineDialog(true);
  };

  const handleConfirmDeleteMedicine = async () => {
    if (medicineToDelete) {
      try {
        const res = await fetch(`/api/mypage/medicine?medicineId=${medicineToDelete}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete medicine');

        // 삭제 성공 후 목록 다시 불러오기
        const medRes = await fetch(`/api/mypage/medicine?userId=${id}`);
        if (medRes.ok) {
          const medData = await medRes.json();
          setMedicines(medData);
        }
      } catch (error) {
        console.error('Failed to delete medicine:', error);
      } finally {
        setShowDeleteMedicineDialog(false);
        setMedicineToDelete(null);
      }
    }
  };

  const handleWithdraw = () => {
    setShowWithdrawDialog(true);
  };

  const handleConfirmWithdraw = async () => {
    try {
      const res = await fetch(`/api/mypage/user?userId=${id}`, {
        method: 'PATCH',
      });

      if (!res.ok) throw new Error('Failed to withdraw');

      // 탈퇴 성공 시 로그아웃 처리 및 홈으로 리다이렉트
      signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Failed to withdraw:', error);
    } finally {
      setShowWithdrawDialog(false);
    }
  };

  const handleAddMedicine = async () => {
    if (!selectedItemSeq || !startDate) return;

    try {
      const res = await fetch('/api/mypage/medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: id,
          itemSeq: selectedItemSeq,
          startDate,
          endDate: endDate || null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert('추가 실패: ' + error.error);
        return;
      }

      // 성공 후 상태 초기화
      setSelectedItemSeq('');
      setStartDate('');
      setEndDate('');
      setShowAddDialog(false);
      setMedicineQuery('');

      // 목록 새로고침
      const refreshed = await fetch(`/api/mypage/medicine?userId=${id}`);
      if (refreshed.ok) {
        const newData = await refreshed.json();
        setMedicines(newData);
      }
    } catch (err) {
      console.error('약 추가 실패:', err);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Image src="/character.svg" alt="약알고" width={40} height={40} />
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">마이알고</h1>
            <p className="text-muted-foreground">
              내 정보와 복용 중인 약, 건강 상태 등을 관리하세요.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={image} alt={name} />
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{name}</h2>
                  <p className="text-sm text-muted-foreground">{email}</p>
                  <Badge className="mt-2">
                    {member_type === 0 ? '일반사용자' : member_type === 1 ? '약사' : '알 수 없음'}
                  </Badge>
                </div>
                <div className="w-full border-t pt-4 mt-2">
                  <nav className="grid gap-1">
                    <Button
                      variant={activeTab === 'profile' ? 'default' : 'ghost'}
                      className="justify-start"
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="mr-2 h-4 w-4" />내 정보
                    </Button>
                    <Button
                      variant={activeTab === 'medicines' ? 'default' : 'ghost'}
                      className="justify-start"
                      onClick={() => setActiveTab('medicines')}
                    >
                      <Pill className="mr-2 h-4 w-4" />
                      복용 중인 약
                    </Button>
                    <Button
                      variant={activeTab === 'posts' ? 'default' : 'ghost'}
                      className="justify-start"
                      onClick={() => setActiveTab('posts')}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />내 게시글
                    </Button>

                    {/* 약사인 경우에만 재고 관리 버튼 표시 */}
                    {member_type === 1 && (
                      <>
                        <div className="h-px bg-border my-2"></div>
                        <Button variant="default" className="justify-start mt-2" asChild>
                          <Link href="/member/inventory" target="_blank" rel="noopener noreferrer">
                            <Store className="mr-2 h-4 w-4" />
                            약국 재고 관리
                          </Link>
                        </Button>
                      </>
                    )}
                  </nav>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>내 정보</CardTitle>
                  <CardDescription>개인 정보를 확인하고 수정할 수 있습니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>이름</Label>
                    <div className="px-3 py-2 border rounded bg-muted">{name}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>이메일</Label>
                    <div className="px-3 py-2 border rounded bg-muted">{email}</div>
                  </div>

                  <div className="h-px bg-border my-4"></div>
                  <h3 className="text-lg font-medium mb-2">현재 건강 상태</h3>
                  <div className="flex flex-wrap gap-2">
                    {healths.length > 0 ? (
                      healths.map((health) => (
                        <Badge key={health.id} variant="secondary" className="px-3 py-1">
                          {health.healthName}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">등록된 건강 상태가 없습니다.</p>
                    )}
                  </div>

                  {/* 약사인 경우 약국 정보 표시 */}
                  {member_type === 1 && (
                    <>
                      <div className="h-px bg-border my-4"></div>
                      <h3 className="text-lg font-medium mb-2">약국 정보</h3>
                      <div className="space-y-2">
                        <Label>약국명</Label>
                        <div className="px-3 py-2 border rounded bg-muted">{pharmacyInfo.name}</div>
                      </div>
                      <div className="space-y-2">
                        <Label>약국 주소</Label>
                        <div className="px-3 py-2 border rounded bg-muted">
                          {pharmacyInfo.address}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto" onClick={handleWithdraw}>
                    회원 탈퇴
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === 'medicines' && (
              <Card>
                <CardHeader>
                  <CardTitle>복용 중인 약</CardTitle>
                  <CardDescription>
                    현재 복용 중인 약과 복용 기록을 관리할 수 있습니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="current">
                    <TabsList>
                      <TabsTrigger value="current">복용 중</TabsTrigger>
                      <TabsTrigger value="history">복용 완료</TabsTrigger>
                    </TabsList>
                    <TabsContent value="current" className="mt-4">
                      <div className="space-y-4">
                        {medicines
                          .filter((med) => med.active)
                          .map((medicine, index) => (
                            <Card key={index}>
                              <Link
                                href={`/medicines/${medicine.item_seq}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <CardContent className="p-4 cursor-pointer hover:bg-gray-50">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-bold">{medicine.name}</h3>
                                      <p className="text-sm mt-1">
                                        {medicine.startDate} ~ {medicine.endDate}
                                      </p>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteMedicine(medicine.id);
                                      }}
                                    >
                                      삭제
                                    </Button>
                                  </div>
                                </CardContent>
                              </Link>
                            </Card>
                          ))}
                        <Button className="w-full" onClick={() => setShowAddDialog(true)}>
                          약 추가하기
                        </Button>

                        {/* Add Medicine Dialog */}
                        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>약 추가</DialogTitle>
                              <DialogDescription>
                                복용할 약을 검색하고 복용 기간을 설정하세요.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>약품 검색</Label>
                                <Input
                                  type="text"
                                  placeholder="약품명을 두 글자 이상 입력하세요"
                                  value={medicineQuery}
                                  onChange={(e) => setMedicineQuery(e.target.value)}
                                />

                                {selectedItemSeq && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    <Badge variant="outline">
                                      {selectedMedicine?.item_name ?? '선택된 약품'}
                                    </Badge>
                                  </div>
                                )}

                                {medicineQuery && (
                                  <div className="border rounded max-h-60 overflow-y-auto mt-2">
                                    {filteredMedicines.length > 0
                                      ? filteredMedicines.map((med) => (
                                          <button
                                            key={med.item_seq}
                                            className="w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
                                            onClick={() => {
                                              setSelectedItemSeq(med.item_seq);
                                              setSelectedMedicine(med); // 선택한 약품 정보 저장
                                              setMedicineQuery('');
                                            }}
                                          >
                                            {med.item_name} ({med.entp_name})
                                          </button>
                                        ))
                                      : medicineQuery.length >= 2 && (
                                          <div className="px-2 py-1 text-sm text-muted-foreground">
                                            검색 결과 없음
                                          </div>
                                        )}
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="start-date">시작 날짜</Label>
                                <Input
                                  id="start-date"
                                  type="date"
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="end-date">종료 날짜 (선택사항)</Label>
                                <Input
                                  id="end-date"
                                  type="date"
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                                취소
                              </Button>
                              <Button type="submit" onClick={handleAddMedicine}>
                                추가
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TabsContent>
                    <TabsContent value="history" className="mt-4">
                      <div className="space-y-4">
                        {medicines
                          .filter((med) => !med.active)
                          .map((medicine, index) => (
                            <Card key={index}>
                              <Link
                                href={`/medicines/${medicine.item_seq}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <CardContent className="p-4 cursor-pointer hover:bg-gray-50">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-bold">{medicine.name}</h3>
                                      <p className="text-sm mt-1">
                                        {medicine.startDate} ~ {medicine.endDate}
                                      </p>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteMedicine(medicine.id);
                                      }}
                                    >
                                      삭제
                                    </Button>
                                  </div>
                                </CardContent>
                              </Link>
                            </Card>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {activeTab === 'posts' && (
              <Card>
                <CardHeader>
                  <CardTitle>내 게시글</CardTitle>
                  <CardDescription>내가 작성한 질문과 게시글을 확인할 수 있습니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="expert">
                    <TabsList>
                      <TabsTrigger value="expert">전문가 Q&A</TabsTrigger>
                      <TabsTrigger value="community">커뮤니티</TabsTrigger>
                    </TabsList>
                    <TabsContent value="expert" className="mt-4">
                      <div className="space-y-4">
                        {posts
                          .filter((post) => post.type === 'expert')
                          .map((post) => (
                            <Link
                              href={`/community/qnas/${post.id}`}
                              key={post.id}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Card className="transition-all hover:shadow-md">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-bold">{post.title}</h3>
                                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <div>{post.date}</div>
                                        <div>답변 {post.answers}개</div>
                                      </div>
                                    </div>
                                    <Badge variant="default" className="bg-primary">
                                      전문가 Q&A
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="community" className="mt-4">
                      <div className="space-y-4">
                        {posts
                          .filter((post) => post.type === 'community')
                          .map((post) => (
                            <Link
                              href={`/community/posts/${post.id}`}
                              key={post.id}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Card className="transition-all hover:shadow-md">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-bold">{post.title}</h3>
                                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <div>{post.date}</div>
                                        <div>댓글 {post.answers}개</div>
                                      </div>
                                    </div>
                                    <Badge variant="outline">커뮤니티</Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      {/* Medicine Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteMedicineDialog} onOpenChange={setShowDeleteMedicineDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>약 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 약을 복용 목록에서 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeleteMedicine}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>회원 탈퇴</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmWithdraw}>탈퇴</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
