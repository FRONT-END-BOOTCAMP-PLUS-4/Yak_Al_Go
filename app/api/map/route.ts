import { NextResponse } from "next/server"
import { GetPharmaciesUseCase } from "../../../backend/application/usecases/pharmacy/GetPharmaciesUseCase"
import type { PharmacySearchRequestDto } from "../../../backend/dto/pharmacy.dto"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const medicine = searchParams.get("medicine")
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const searchQuery = searchParams.get("search")
  const day = searchParams.get("day")
  const hour = searchParams.get("hour")
  const minute = searchParams.get("minute")
  const showOnlyOpen = searchParams.get("showOnlyOpen")

  try {
    const getPharmaciesUseCase = new GetPharmaciesUseCase()

    const requestDto: PharmacySearchRequestDto = {
      medicine: medicine || undefined,
      location: lat && lng ? { lat: Number.parseFloat(lat), lng: Number.parseFloat(lng) } : undefined,
      searchQuery: searchQuery || undefined,
      day: day ? Number.parseInt(day) : undefined,
      hour: hour ? Number.parseInt(hour) : undefined,
      minute: minute ? Number.parseInt(minute) : undefined,
      showOnlyOpen: showOnlyOpen === "true",
    }

    const result = await getPharmaciesUseCase.execute(requestDto)
    return NextResponse.json(result.pharmacies)
  } catch (error) {
    console.error("Error in map API:", error)
    return NextResponse.json({ error: "약국 데이터를 가져오는데 실패했습니다." }, { status: 500 })
  }
}
