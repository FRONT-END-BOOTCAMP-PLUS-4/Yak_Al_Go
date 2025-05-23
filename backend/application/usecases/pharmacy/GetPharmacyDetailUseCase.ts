import type { PharmacyDto, PharmacyDetailDto, PharmacyOperatingHoursDto } from "../../../dto/pharmacy.dto"
import { CheckPharmacyOpenStatusUseCase } from "./CheckPharmacyOpenStatusUseCase"

export class GetPharmacyDetailUseCase {
  private checkPharmacyOpenStatusUseCase: CheckPharmacyOpenStatusUseCase

  constructor() {
    this.checkPharmacyOpenStatusUseCase = new CheckPharmacyOpenStatusUseCase()
  }

  execute(pharmacy: PharmacyDto): PharmacyDetailDto {
    const operatingHours = this.getOperatingHours(pharmacy)
    const todayHours = this.getTodayHours(pharmacy)
    const isCurrentlyOpen = this.checkPharmacyOpenStatusUseCase.execute(
      pharmacy,
      new Date().getDay(),
      new Date().getHours(),
      new Date().getMinutes(),
    )

    return {
      ...pharmacy,
      operatingHours,
      todayHours,
      isCurrentlyOpen,
    }
  }

  private getOperatingHours(pharmacy: PharmacyDto): PharmacyOperatingHoursDto {
    return {
      monday: this.formatWeekdayHours(pharmacy.duty_time1s, pharmacy.duty_time1c),
      tuesday: this.formatWeekdayHours(pharmacy.duty_time2s, pharmacy.duty_time2c),
      wednesday: this.formatWeekdayHours(pharmacy.duty_time3s, pharmacy.duty_time3c),
      thursday: this.formatWeekdayHours(pharmacy.duty_time4s, pharmacy.duty_time4c),
      friday: this.formatWeekdayHours(pharmacy.duty_time5s, pharmacy.duty_time5c),
      saturday: this.formatWeekdayHours(pharmacy.duty_time6s, pharmacy.duty_time6c),
      sunday: this.formatWeekdayHours(pharmacy.duty_time7s, pharmacy.duty_time7c),
    }
  }

  private getTodayHours(pharmacy: PharmacyDto): string {
    const dayOfWeek = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.

    let startTime: string, endTime: string

    switch (dayOfWeek) {
      case 0: // Sunday
        startTime = pharmacy.duty_time7s
        endTime = pharmacy.duty_time7c
        break
      case 1: // Monday
        startTime = pharmacy.duty_time1s
        endTime = pharmacy.duty_time1c
        break
      case 2: // Tuesday
        startTime = pharmacy.duty_time2s
        endTime = pharmacy.duty_time2c
        break
      case 3: // Wednesday
        startTime = pharmacy.duty_time3s
        endTime = pharmacy.duty_time3c
        break
      case 4: // Thursday
        startTime = pharmacy.duty_time4s
        endTime = pharmacy.duty_time4c
        break
      case 5: // Friday
        startTime = pharmacy.duty_time5s
        endTime = pharmacy.duty_time5c
        break
      case 6: // Saturday
        startTime = pharmacy.duty_time6s
        endTime = pharmacy.duty_time6c
        break
      default:
        return "정보 없음"
    }

    return this.formatWeekdayHours(startTime, endTime)
  }

  private formatWeekdayHours(startTimeStr: string | null | undefined, endTimeStr: string | null | undefined): string {
    if (!startTimeStr || !endTimeStr) return "휴무일"

    const startTime = this.formatTimeString(startTimeStr)
    const endTime = this.formatTimeString(endTimeStr)

    if (!startTime || !endTime) return "휴무일"

    return `${startTime} - ${endTime}`
  }

  private formatTimeString(timeStr: string | null | undefined): string | null {
    if (!timeStr) {
      return null
    }

    // 이미 "시:분" 형태인 경우 그대로 반환
    if (timeStr.includes(":")) {
      return timeStr
    }

    // 4자리 숫자 형태인 경우 "시:분" 형태로 변환
    if (timeStr.length === 4) {
      const hour = timeStr.substring(0, 2)
      const minute = timeStr.substring(2, 4)
      return `${hour}:${minute}`
    }

    return timeStr
  }
}
