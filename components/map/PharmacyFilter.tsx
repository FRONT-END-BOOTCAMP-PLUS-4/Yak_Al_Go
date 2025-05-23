"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PopoverContent } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface PharmacyFilterProps {
  selectedMedicine: string
  setSelectedMedicine: (medicine: string) => void
  selectedDays: string[]
  setSelectedDays: (days: string[]) => void
  selectedHour: string
  setSelectedHour: (hour: string) => void
  selectedMinute: string
  setSelectedMinute: (minute: string) => void
  showOnlyOpen: boolean
  setShowOnlyOpen: (show: boolean) => void
  resetFilters: () => void
  medicines: string[]
}

export const PharmacyFilter: React.FC<PharmacyFilterProps> = ({
  selectedMedicine,
  setSelectedMedicine,
  selectedDays,
  setSelectedDays,
  selectedHour,
  setSelectedHour,
  selectedMinute,
  setSelectedMinute,
  showOnlyOpen,
  setShowOnlyOpen,
  resetFilters,
  medicines,
}) => {
  // 시간 입력 처리
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 숫자만 입력 가능하도록
    if (/^\d*$/.test(value)) {
      // 0-23 범위 내에서만 허용
      const hour = Number.parseInt(value, 10)
      if (!value || (hour >= 0 && hour <= 23)) {
        setSelectedHour(value)
      }
    }
  }

  // 분 입력 처리
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 숫자만 입력 가능하도록
    if (/^\d*$/.test(value)) {
      // 0-59 범위 내에서만 허용
      const minute = Number.parseInt(value, 10)
      if (!value || (minute >= 0 && minute <= 59)) {
        setSelectedMinute(value)
      }
    }
  }

  // 요일 선택 처리
  const handleDayChange = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day))
    } else {
      setSelectedDays([...selectedDays, day])
    }
  }

  const days = [
    { value: "1", label: "월요일" },
    { value: "2", label: "화요일" },
    { value: "3", label: "수요일" },
    { value: "4", label: "목요일" },
    { value: "5", label: "금요일" },
    { value: "6", label: "토요일" },
    { value: "0", label: "일요일" },
  ]

  return (
    <PopoverContent className="w-80">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="medicine">약품</Label>
          <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
            <SelectTrigger id="medicine">
              <SelectValue placeholder="약품 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체</SelectItem>
              {medicines.map((medicine) => (
                <SelectItem key={medicine} value={medicine}>
                  {medicine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 요일 다중 선택 - 아코디언 사용 */}
        <div className="space-y-2">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="days">
              <AccordionTrigger className="py-2">요일 (다중 선택 가능)</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {days.map((day) => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day.value}`}
                        checked={selectedDays.includes(day.value)}
                        onCheckedChange={() => handleDayChange(day.value)}
                      />
                      <Label htmlFor={`day-${day.value}`} className="text-sm cursor-pointer">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* 시간과 분 입력 (한 줄에 배치) */}
        <div className="space-y-2">
          <Label>시간</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={selectedHour}
              onChange={handleHourChange}
              placeholder="시"
              className="w-1/2"
            />
            <span>:</span>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={selectedMinute}
              onChange={handleMinuteChange}
              placeholder="분"
              className="w-1/2"
            />
          </div>
        </div>

        {/* 영업중 필터링 옵션 */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showOnlyOpen"
            checked={showOnlyOpen}
            onCheckedChange={(checked) => setShowOnlyOpen(checked === true)}
          />
          <Label htmlFor="showOnlyOpen" className="text-sm cursor-pointer">
            영업중인 약국만 보기
          </Label>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={resetFilters}>
            초기화
          </Button>
        </div>
      </div>
    </PopoverContent>
  )
}
