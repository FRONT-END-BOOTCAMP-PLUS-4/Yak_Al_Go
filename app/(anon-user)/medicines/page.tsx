'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

// Mock data for medicines
const medicinesData = [
  {
    id: 1,
    name: '타이레놀',
    company: '한국얀센',
    type: '진통제',
    description: '해열, 진통, 소염 작용',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 2,
    name: '판콜에이',
    company: '동아제약',
    type: '감기약',
    description: '감기 증상 완화',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 3,
    name: '게보린',
    company: '삼진제약',
    type: '진통제',
    description: '두통, 치통, 생리통 완화',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 4,
    name: '베아제',
    company: '대웅제약',
    type: '소화제',
    description: '소화불량, 체함, 위부팽만감',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 5,
    name: '훼스탈골드',
    company: '한독',
    type: '소화제',
    description: '소화불량, 식체, 위부팽만감',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 6,
    name: '판피린',
    company: '동아제약',
    type: '진통제',
    description: '두통, 치통, 근육통 완화',
    image: '/placeholder.svg?height=80&width=80',
  },
];

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState(medicinesData);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Handle sorting
  const handleSort = () => {
    if (sortOrder === null || sortOrder === 'desc') {
      // Sort ascending (가나다순)
      setMedicines([...medicines].sort((a, b) => a.name.localeCompare(b.name, 'ko')));
      setSortOrder('asc');
    } else {
      // Sort descending (역가나다순)
      setMedicines([...medicines].sort((a, b) => b.name.localeCompare(a.name, 'ko')));
      setSortOrder('desc');
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter medicines based on search query and active tab
  useEffect(() => {
    let filtered = medicinesData;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          medicine.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          medicine.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab filter
    if (activeTab !== 'all') {
      const typeMap: Record<string, string> = {
        painkillers: '진통제',
        cold: '감기약',
        digestive: '소화제',
        antibiotics: '항생제',
      };
      filtered = filtered.filter((medicine) => medicine.type === typeMap[activeTab]);
    }

    // Apply current sort order if exists
    if (sortOrder === 'asc') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    } else if (sortOrder === 'desc') {
      filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name, 'ko'));
    }

    setMedicines(filtered);
  }, [searchQuery, activeTab, sortOrder]);

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">약 검색</h1>
          <p className="text-muted-foreground">약 이름, 성분, 제조사 등으로 검색하여 원하는 약을 찾아보세요.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex w-full items-center space-x-2">
            <Input type="text" placeholder="약 이름, 성분, 제조사 검색" value={searchQuery} onChange={handleSearch} />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2" onClick={handleSort}>
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === 'asc' ? '가나다순 ↓' : sortOrder === 'desc' ? '가나다순 ↑' : '가나다순'}
            </Button>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              필터
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="painkillers">진통제</TabsTrigger>
            <TabsTrigger value="cold">감기약</TabsTrigger>
            <TabsTrigger value="digestive">소화제</TabsTrigger>
            <TabsTrigger value="antibiotics">항생제</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {medicines.length > 0 ? (
                medicines.map((medicine) => (
                  <Link href={`/medicines/${medicine.id}`} key={medicine.id}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={medicine.image || '/placeholder.svg'}
                              alt={medicine.name}
                              width={80}
                              height={80}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold">{medicine.name}</h3>
                              <Badge variant="outline">{medicine.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{medicine.company}</p>
                            <p className="text-sm">{medicine.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="painkillers" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {medicines.length > 0 ? (
                medicines.map((medicine) => (
                  <Link href={`/medicines/${medicine.id}`} key={medicine.id}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={medicine.image || '/placeholder.svg'}
                              alt={medicine.name}
                              width={80}
                              height={80}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold">{medicine.name}</h3>
                              <Badge variant="outline">{medicine.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{medicine.company}</p>
                            <p className="text-sm">{medicine.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="cold" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {medicines.length > 0 ? (
                medicines.map((medicine) => (
                  <Link href={`/medicines/${medicine.id}`} key={medicine.id}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={medicine.image || '/placeholder.svg'}
                              alt={medicine.name}
                              width={80}
                              height={80}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold">{medicine.name}</h3>
                              <Badge variant="outline">{medicine.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{medicine.company}</p>
                            <p className="text-sm">{medicine.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="digestive" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {medicines.length > 0 ? (
                medicines.map((medicine) => (
                  <Link href={`/medicines/${medicine.id}`} key={medicine.id}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={medicine.image || '/placeholder.svg'}
                              alt={medicine.name}
                              width={80}
                              height={80}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold">{medicine.name}</h3>
                              <Badge variant="outline">{medicine.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{medicine.company}</p>
                            <p className="text-sm">{medicine.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="antibiotics" className="mt-4">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">검색 결과가 없습니다.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
