import { NextResponse } from "next/server"
import { GetMedicinesUseCase } from "../../../backend/application/usecases/medicine/GetMedicinesUseCase"

export async function GET() {
  try {
    const getMedicinesUseCase = new GetMedicinesUseCase()
    const medicines = await getMedicinesUseCase.execute()
    return NextResponse.json(medicines)
  } catch (error) {
    console.error("Error in medicines API:", error)
    return NextResponse.json({ error: "약품 데이터를 가져오는데 실패했습니다." }, { status: 500 })
  }
}
