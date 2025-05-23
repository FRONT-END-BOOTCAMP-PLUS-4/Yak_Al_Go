export interface MedicineDto {
  item_seq: string
  item_name: string
}

export interface InventoryDto {
  id: number
  quantity: number
  itemSeq: string
  hpid: string
  medicines: MedicineDto
}

export interface PharmacyDto {
  hpid: string
  duty_name: string
  duty_addr: string
  duty_tel1: string
  wgs84_lat: number
  wgs84_lon: number
  duty_time1s: string
  duty_time1c: string
  duty_time2s: string
  duty_time2c: string
  duty_time3s: string
  duty_time3c: string
  duty_time4s: string
  duty_time4c: string
  duty_time5s: string
  duty_time5c: string
  duty_time6s: string
  duty_time6c: string
  duty_time7s: string
  duty_time7c: string
  inventories: InventoryDto[]
  isOpen?: boolean
  distance?: number
}

export interface LocationDto {
  lat: number
  lng: number
}

export interface PharmacySearchRequestDto {
  medicine?: string
  location?: LocationDto
  searchQuery?: string
  day?: number
  hour?: number
  minute?: number
  showOnlyOpen?: boolean
}

export interface PharmacySearchResponseDto {
  pharmacies: PharmacyDto[]
  totalCount: number
}

export interface PharmacyOperatingHoursDto {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

export interface PharmacyDetailDto extends PharmacyDto {
  operatingHours: PharmacyOperatingHoursDto
  todayHours: string
  isCurrentlyOpen: boolean
}
