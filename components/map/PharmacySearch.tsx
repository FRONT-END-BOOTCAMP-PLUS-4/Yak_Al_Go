"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Navigation, Filter } from "lucide-react"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { PharmacyFilter } from "./PharmacyFilter"

interface PharmacySearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  getCurrentLocation: () => void
  showFilterPopover: boolean
  setShowFilterPopover: (show: boolean) => void
  selectedMedicine: string
  setSelectedMedicine: (medicine: string) => void
  selectedDays: string[] // 배열로 변경
  setSelectedDays: (days: string[]) => void // 배열로 변경
  selectedHour: string
  setSelectedHour: (hour: string) => void
  selectedMinute: string
  setSelectedMinute: (minute: string) => void
  showOnlyOpen: boolean
  setShowOnlyOpen: (show: boolean) => void
  resetFilters: () => void
  medicines: string[]
  mapCenter: { lat: number; lng: number }
  setMapCenter: (center: { lat: number; lng: number }) => void
  locationUpdateSourceRef: React.MutableRefObject<"user" | "map" | "init">
}

export const PharmacySearch: React.FC<PharmacySearchProps> = ({
  searchQuery,
  setSearchQuery,
  getCurrentLocation,
  showFilterPopover,
  setShowFilterPopover,
  selectedMedicine,
  setSelectedMedicine,
  selectedDays, // 변경된 prop 이름
  setSelectedDays, // 변경된 prop 이름
  selectedHour,
  setSelectedHour,
  selectedMinute,
  setSelectedMinute,
  showOnlyOpen,
  setShowOnlyOpen,
  resetFilters,
  medicines,
  mapCenter,
  setMapCenter,
  locationUpdateSourceRef,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="약국 이름, 주소, 약품명 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      <Button className="flex gap-2" onClick={getCurrentLocation}>
        <Navigation className="h-4 w-4" />내 위치
      </Button>
      <Popover
        open={showFilterPopover}
        onOpenChange={(open) => {
          setShowFilterPopover(open)
          // 지도 중심 변경 방지를 위한 플래그 설정
          locationUpdateSourceRef.current = "map"

          // 현재 지도 중심 유지
          const currentCenter = { ...mapCenter }
          setMapCenter(currentCenter)
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" />
            필터
          </Button>
        </PopoverTrigger>
        <PharmacyFilter
          selectedMedicine={selectedMedicine}
          setSelectedMedicine={setSelectedMedicine}
          selectedDays={selectedDays} // 변경된 prop 이름
          setSelectedDays={setSelectedDays} // 변경된 prop 이름
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
          selectedMinute={selectedMinute}
          setSelectedMinute={setSelectedMinute}
          showOnlyOpen={showOnlyOpen}
          setShowOnlyOpen={setShowOnlyOpen}
          resetFilters={resetFilters}
          medicines={medicines}
        />
      </Popover>
    </div>
  )
}
