// 클린 아키텍처로 이동된 함수들을 위한 래퍼
import { CalculateDistanceUseCase } from "../../../backend/application/usecases/pharmacy/CalculateDistanceUseCase"
import { CheckPharmacyOpenStatusUseCase } from "../../../backend/application/usecases/pharmacy/CheckPharmacyOpenStatusUseCase"
import type { PharmacyDto } from "../../../backend/dto/pharmacy.dto"

const calculateDistanceUseCase = new CalculateDistanceUseCase()
const checkPharmacyOpenStatusUseCase = new CheckPharmacyOpenStatusUseCase()

// 4자리 숫자 형태의 시간을 "시:분" 형태로 변환하는 함수
export const formatTimeString = (timeStr: string | null | undefined): string | null => {
  if (!timeStr) {
    return null
  }

  if (timeStr.includes(":")) {
    return timeStr
  }

  if (timeStr.length === 4) {
    const hour = timeStr.substring(0, 2)
    const minute = timeStr.substring(2, 4)
    return `${hour}:${minute}`
  }

  return timeStr
}

// 약국이 특정 요일과 시간에 영업 중인지 확인하는 함수
export const checkPharmacyOpenAtTime = (pharmacy: PharmacyDto, day: number, hour: number, minute: number): boolean => {
  return checkPharmacyOpenStatusUseCase.execute(pharmacy, day, hour, minute)
}

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  return calculateDistanceUseCase.execute(lat1, lon1, lat2, lon2)
}

export const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180)
}
