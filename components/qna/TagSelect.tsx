'use client';

import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTags } from '@/lib/queries/useTags';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag } from '@/backend/domain/entities/tagEntity';

interface TagSelectProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

export function TagSelect({ selectedTags, onTagsChange }: TagSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const { data: tags = [], isLoading } = useTags();

  const filteredTags = tags.filter(
    (tag) => tag.name.toLowerCase().includes(search.toLowerCase()) && !selectedTags.includes(tag)
  );

  const handleSelect = (tag: Tag) => {
    onTagsChange([...selectedTags, tag]);
    setSearch('');
  };

  const handleRemove = (tagToRemove: Tag) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 w-full border rounded-md p-2 min-h-[40px]">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-4 shrink-0 opacity-50 ml-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex flex-wrap items-center gap-2 w-full border rounded-md p-2 min-h-[40px]">
            {selectedTags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="cursor-pointer" onClick={() => handleRemove(tag)}>
                {tag.name} <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
            <div className="flex-1 outline-none bg-transparent text-gray-500">
              {selectedTags.length === 0 ? '태그를 선택하세요' : ''}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" side="bottom" align="start">
          <Command>
            <CommandInput
              placeholder="태그 검색..."
              onValueChange={(value) => {
                setSearch(value);
              }}
              value={search} // controlled component으로 관리하기 위해서 세팅
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredTags.length > 0 && !isComposing) {
                  handleSelect(filteredTags[0]);
                }
              }}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
            />
            <CommandEmpty>태그를 찾을 수 없습니다.</CommandEmpty>
            <CommandGroup>
              {filteredTags.map((tag) => (
                <CommandItem key={tag.id} value={tag.name} onSelect={() => handleSelect(tag)}>
                  <Check className={cn('mr-2 h-4 w-4', selectedTags.includes(tag) ? 'opacity-100' : 'opacity-0')} />
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
