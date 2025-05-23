import type { PharmacyDto } from "../../../dto/pharmacy.dto"

export class CheckPharmacyOpenStatusUseCase {
  execute(pharmacy: PharmacyDto, day: number, hour: number, minute: number): boolean {
    // 요일에 따른 시작/종료 시간 가져오기
    let startTimeStr: string, endTimeStr: string

    switch (day) {
      case 0: // Sunday
        startTimeStr = pharmacy.duty_time7s
        endTimeStr = pharmacy.duty_time7c
        break
      case 1: // Monday
        startTimeStr = pharmacy.duty_time1s
        endTimeStr = pharmacy.duty_time1c
        break
      case 2: // Tuesday
        startTimeStr = pharmacy.duty_time2s
        endTimeStr = pharmacy.duty_time2c
        break
      case 3: // Wednesday
        startTimeStr = pharmacy.duty_time3s
        endTimeStr = pharmacy.duty_time3c
        break
      case 4: // Thursday
        startTimeStr = pharmacy.duty_time4s
        endTimeStr = pharmacy.duty_time4c
        break
      case 5: // Friday
        startTimeStr = pharmacy.duty_time5s
        endTimeStr = pharmacy.duty_time5c
        break
      case 6: // Saturday
        startTimeStr = pharmacy.duty_time6s
        endTimeStr = pharmacy.duty_time6c
        break
      default:
        return false
    }

    // 시작 시간이나 종료 시간이 null, undefined 또는 빈 문자열이면 영업 종료
    if (!startTimeStr || !endTimeStr || startTimeStr === "" || endTimeStr === "") {
      return false
    }

    const startTime = this.formatTimeString(startTimeStr)
    const endTime = this.formatTimeString(endTimeStr)

    // 변환된 시간이 null이면 영업 종료
    if (!startTime || !endTime) {
      return false
    }

    // 시간 비교
    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    const checkTimeInMinutes = hour * 60 + minute
    const startTimeInMinutes = startHour * 60 + startMinute
    const endTimeInMinutes = endHour * 60 + endMinute

    // 종료 시간이 시작 시간보다 이른 경우 (다음 날까지 영업)
    if (endTimeInMinutes < startTimeInMinutes) {
      return checkTimeInMinutes >= startTimeInMinutes || checkTimeInMinutes <= endTimeInMinutes
    } else {
      return checkTimeInMinutes >= startTimeInMinutes && checkTimeInMinutes <= endTimeInMinutes
    }
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
