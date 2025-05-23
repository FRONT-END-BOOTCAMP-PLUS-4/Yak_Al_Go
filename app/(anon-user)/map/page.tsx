"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { PharmacySearch } from "@/components/map/PharmacySearch"
import { PharmacyList } from "@/components/map/PharmacyList"
import { PharmacyDetail } from "@/components/map/PharmacyDetail"
import type { PharmacyType } from "@/types/map/types"
import { formatTimeString, checkPharmacyOpenAtTime, calculateDistance } from "@/backend/utils/map/utils"

// KakaoMap 컴포넌트 동적 import (SSR 비활성화)
const KakaoMap = dynamic(() => import("@/components/map/KakaoMap"), {
  ssr: false,
})

export default function MapPage() {
  const searchParams = useSearchParams()
  const medicineName = searchParams.get("medicine")

  // 현재 시간 가져오기
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentDay = now.getDay().toString() // 현재 요일 (0-6)

  const [selectedPharmacyIndex, setSelectedPharmacyIndex] = useState<number | null>(null)
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [pharmacies, setPharmacies] = useState<PharmacyType[]>([])
  const [filteredPharmacies, setFilteredPharmacies] = useState<PharmacyType[]>([])

  const [selectedMedicine, setSelectedMedicine] = useState(medicineName || "전체")

  // 시간 필터 상태 변경
  const [selectedDays, setSelectedDays] = useState<string[]>([currentDay]) // 다중 선택을 위해 배열로 변경
  const [selectedHour, setSelectedHour] = useState<string>(currentHour.toString())
  const [selectedMinute, setSelectedMinute] = useState<string>(currentMinute.toString())
  const [showOnlyOpen, setShowOnlyOpen] = useState<boolean>(true) // 기본적으로 영업중인 약국만 표시

  const [showFilterPopover, setShowFilterPopover] = useState(false)
  const [medicines, setMedicines] = useState<string[]>([])
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  // 초기 위치 설정 (서울 중심)
  const [defaultLocation] = useState<{ lat: number; lng: number }>({
    lat: 37.5665,
    lng: 126.978,
  })

  // 지도 중심 위치를 추적하는 상태 변수 추가
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(defaultLocation)

  // 위치 업데이트 소스를 추적하기 위한 ref
  const locationUpdateSourceRef = useRef<"user" | "map" | "init">("init")

  // Fetch pharmacies and medicines data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pharmacies
        const pharmaciesUrl = selectedMedicine
          ? `/api/map?medicine=${encodeURIComponent(selectedMedicine)}`
          : "/api/map"

        const pharmaciesRes = await fetch(pharmaciesUrl)
        const pharmaciesData = await pharmaciesRes.json()

        if (Array.isArray(pharmaciesData)) {
          // 각 약국의 영업 상태 확인 (현재 요일 기준)
          const pharmaciesWithOpenStatus = pharmaciesData.map((pharmacy) => ({
            ...pharmacy,
            isOpen: checkPharmacyOpenAtTime(
              pharmacy,
              Number(currentDay),
              new Date().getHours(),
              new Date().getMinutes(),
            ),
          }))

          setPharmacies(pharmaciesWithOpenStatus)

          // 약국 데이터를 가져온 후 현재 지도 중심 기준으로 정렬
          sortPharmaciesByDistance(pharmaciesWithOpenStatus, mapCenter)
        }

        // Fetch medicines for filter
        const medicinesRes = await fetch("/api/medicines")
        const medicinesData = await medicinesRes.json()

        if (Array.isArray(medicinesData)) {
          const medicineNames = [...new Set(medicinesData.map((med: any) => med.item_name))]
          setMedicines(medicineNames)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [selectedMedicine, currentDay])

  // 약국을 거리순으로 정렬하는 함수
  const sortPharmaciesByDistance = (pharmaciesToSort: PharmacyType[], center: { lat: number; lng: number }) => {
    const sorted = [...pharmaciesToSort].sort((a, b) => {
      const distA = calculateDistance(center.lat, center.lng, Number(a.wgs84_lat), Number(a.wgs84_lon))
      const distB = calculateDistance(center.lat, center.lng, Number(b.wgs84_lat), Number(b.wgs84_lon))
      return distA - distB
    })

    setFilteredPharmacies(sorted)
  }

  // Filter pharmacies based on search query and filters
  useEffect(() => {
    filterPharmacies()
  }, [searchQuery, selectedDays, selectedHour, selectedMinute, pharmacies, showOnlyOpen, selectedMedicine])

  // 선택된 요일과 시간에 약국이 영업 중인지 확인하는 함수 (다중 요일 지원)
  const checkPharmacyOpenAtSelectedDaysAndTime = (pharmacy: PharmacyType): boolean => {
    // 선택된 시간이 없으면 현재 시간 사용
    const hour = selectedHour ? Number.parseInt(selectedHour) : new Date().getHours()
    const minute = selectedMinute ? Number.parseInt(selectedMinute) : new Date().getMinutes()

    // 선택된 요일이 없으면 항상 닫힘으로 처리
    if (selectedDays.length === 0) return false

    // 선택된 요일 중 하나라도 영업 중이면 true 반환
    return selectedDays.some((day) => {
      return checkPharmacyOpenAtTime(pharmacy, Number(day), hour, minute)
    })
  }

  // filterPharmacies 함수
  const filterPharmacies = () => {
    let filtered = [...pharmacies]

    // 검색어로 필터링
    if (searchQuery) {
      filtered = filtered.filter(
        (pharmacy) =>
          pharmacy.duty_name.includes(searchQuery) ||
          pharmacy.duty_addr.includes(searchQuery) ||
          // 약품명으로도 검색 가능하도록 추가
          pharmacy.inventories.some((inv) => inv.medicines.item_name.includes(searchQuery)),
      )
    }

    // 약품으로 필터링 (selectedMedicine이 "전체"가 아닐 때)
    if (selectedMedicine && selectedMedicine !== "전체") {
      filtered = filtered.filter((pharmacy) =>
        pharmacy.inventories.some((inv) => inv.medicines.item_name === selectedMedicine),
      )
    }

    // 선택된 요일들과 시간 기준으로 영업 상태 확인
    filtered = filtered.map((pharmacy) => {
      const isOpen = checkPharmacyOpenAtSelectedDaysAndTime(pharmacy)
      return {
        ...pharmacy,
        isOpen,
      }
    })

    // 영업중인 약국만 표시 옵션이 활성화되어 있으면 필터링
    if (showOnlyOpen) {
      filtered = filtered.filter((pharmacy) => pharmacy.isOpen)
    }

    // 필터링 후에도 거리순 정렬 유지
    filtered.sort((a, b) => {
      const distA = calculateDistance(mapCenter.lat, mapCenter.lng, Number(a.wgs84_lat), Number(a.wgs84_lon))
      const distB = calculateDistance(mapCenter.lat, mapCenter.lng, Number(b.wgs84_lat), Number(b.wgs84_lon))
      return distA - distB
    })

    setFilteredPharmacies(filtered)
  }

  const resetFilters = () => {
    const now = new Date()
    setSelectedMedicine("전체")
    setSelectedDays([now.getDay().toString()])
    setSelectedHour(now.getHours().toString())
    setSelectedMinute(now.getMinutes().toString())
    setShowFilterPopover(false)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const newLocation = { lat: latitude, lng: longitude }
          setCurrentLocation(newLocation)
          setMapCenter(newLocation) // 현재 위치를 지도 중심으로 설정
          locationUpdateSourceRef.current = "user"

          // 선택된 약국 초기화
          if (selectedPharmacyIndex !== null) {
            setSelectedPharmacyIndex(null)
            setSelectedPharmacy(null)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("위치 정보를 가져오는데 실패했습니다.")
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        },
      )
    } else {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.")
    }
  }

  // Format distance for display
  const formatDistance = (lat: number, lon: number) => {
    const distance = calculateDistance(mapCenter.lat, mapCenter.lng, Number(lat), Number(lon))
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`
  }

  // Get formatted operating hours for today
  const getTodayHours = (pharmacy: PharmacyType) => {
    const dayOfWeek = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.

    let startTime, endTime

    switch (dayOfWeek) {
      case 0: // Sunday
        startTime = formatTimeString(pharmacy.duty_time7s)
        endTime = formatTimeString(pharmacy.duty_time7c)
        break
      case 1: // Monday
        startTime = formatTimeString(pharmacy.duty_time1s)
        endTime = formatTimeString(pharmacy.duty_time1c)
        break
      case 2: // Tuesday
        startTime = formatTimeString(pharmacy.duty_time2s)
        endTime = formatTimeString(pharmacy.duty_time2c)
        break
      case 3: // Wednesday
        startTime = formatTimeString(pharmacy.duty_time3s)
        endTime = formatTimeString(pharmacy.duty_time3c)
        break
      case 4: // Thursday
        startTime = formatTimeString(pharmacy.duty_time4s)
        endTime = formatTimeString(pharmacy.duty_time4c)
        break
      case 5: // Friday
        startTime = formatTimeString(pharmacy.duty_time5s)
        endTime = formatTimeString(pharmacy.duty_time5c)
        break
      case 6: // Saturday
        startTime = formatTimeString(pharmacy.duty_time6s)
        endTime = formatTimeString(pharmacy.duty_time6c)
        break
      default:
        return "정보 없음"
    }

    if (!startTime || !endTime) return "휴무일"

    return `${startTime} - ${endTime}`
  }

  // Get medicine names from pharmacy inventories
  const getPharmacyMedicines = (pharmacy: PharmacyType) => {
    return pharmacy.inventories.map((inv) => inv.medicines.item_name)
  }

  // Handle pharmacy selection
  const handleSelectPharmacy = (index: number | null) => {
    setSelectedPharmacyIndex(index)
    setSelectedPharmacy(index !== null ? filteredPharmacies[index] : null)

    // 선택된 약국이 있을 때만 지도 중심을 약국 위치로 설정
    if (index !== null) {
      const pharmacy = filteredPharmacies[index]
      const pharmacyLocation = {
        lat: Number(pharmacy.wgs84_lat),
        lng: Number(pharmacy.wgs84_lon),
      }
      setMapCenter(pharmacyLocation)
      locationUpdateSourceRef.current = "user"
    }
    // 선택이 해제될 때는 지도 중심을 변경하지 않음 (else 블록 없음)
  }

  // 요일별 영업 시간 포맷팅
  const formatWeekdayHours = (startTimeStr: string | null | undefined, endTimeStr: string | null | undefined) => {
    if (!startTimeStr || !endTimeStr) return "휴무일"

    const startTime = formatTimeString(startTimeStr)
    const endTime = formatTimeString(endTimeStr)

    if (!startTime || !endTime) return "휴무일"

    return `${startTime} - ${endTime}`
  }

  // 지도 중심 변경 핸들러 추가
  const handleMapCenterChanged = (center: { lat: number; lng: number }) => {
    // 항상 mapCenter 업데이트 및 약국 리스트 재정렬
    setMapCenter(center)
    locationUpdateSourceRef.current = "map"

    // 지도 중심이 변경되면 약국 리스트를 재정렬
    if (filteredPharmacies.length > 0) {
      sortPharmaciesByDistance(filteredPharmacies, center)
    }

    // 플래그 초기화
    setTimeout(() => {
      locationUpdateSourceRef.current = "map"
    }, 100)
  }

  // 약국 상세 정보 닫기 핸들러
  const handleClosePharmacyDetail = () => {
    // 약국 정보창 닫기
    setSelectedPharmacy(null)
    setSelectedPharmacyIndex(null)

    // 지도 중심 변경 방지를 위한 플래그 설정
    locationUpdateSourceRef.current = "map"

    // 현재 지도 중심 유지
    const currentCenter = { ...mapCenter }
    setMapCenter(currentCenter)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">약국 찾기</h1>
          <p className="text-muted-foreground">내 주변 약국을 찾고 약품 재고를 확인해보세요.</p>
        </div>

        <PharmacySearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          getCurrentLocation={getCurrentLocation}
          showFilterPopover={showFilterPopover}
          setShowFilterPopover={setShowFilterPopover}
          selectedMedicine={selectedMedicine}
          setSelectedMedicine={setSelectedMedicine}
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          selectedHour={selectedHour}
          setSelectedHour={setSelectedHour}
          selectedMinute={selectedMinute}
          setSelectedMinute={setSelectedMinute}
          showOnlyOpen={showOnlyOpen}
          setShowOnlyOpen={setShowOnlyOpen}
          resetFilters={resetFilters}
          medicines={medicines}
          mapCenter={mapCenter}
          setMapCenter={setMapCenter}
          locationUpdateSourceRef={locationUpdateSourceRef}
        />

        <div className="grid gap-6 md:grid-cols-[350px_1fr]">
          <div className="order-2 md:order-1">
            <PharmacyList
              filteredPharmacies={filteredPharmacies}
              selectedPharmacyIndex={selectedPharmacyIndex}
              handleSelectPharmacy={handleSelectPharmacy}
              selectedMedicine={selectedMedicine}
              getTodayHours={getTodayHours}
              formatDistance={formatDistance}
              getPharmacyMedicines={getPharmacyMedicines}
            />
          </div>

          <div className="order-1 md:order-2">
            <Card className="h-full">
              <CardContent className="p-0 relative">
                <div className="h-[600px] bg-muted relative">
                  {
                    <KakaoMap
                      pharmacies={filteredPharmacies.map((p) => ({
                        dutyName: p.duty_name,
                        wgs84Lat: Number(p.wgs84_lat),
                        wgs84Lon: Number(p.wgs84_lon),
                      }))}
                      selected={selectedPharmacyIndex}
                      onSelect={handleSelectPharmacy}
                      currentLocation={currentLocation}
                      mapCenter={mapCenter}
                      defaultCenter={defaultLocation}
                      onCenterChanged={handleMapCenterChanged}
                    />
                  }

                  {/* Pharmacy detail modal */}
                  {selectedPharmacy && (
                    <PharmacyDetail
                      selectedPharmacy={selectedPharmacy}
                      selectedMedicine={selectedMedicine}
                      getTodayHours={getTodayHours}
                      formatWeekdayHours={formatWeekdayHours}
                      onClose={handleClosePharmacyDetail}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
