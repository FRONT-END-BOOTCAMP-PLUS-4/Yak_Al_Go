import type { MedicineDto } from "../../../dto/pharmacy.dto"
import prisma from "../../../../lib/prisma"

export class GetMedicinesUseCase {
  async execute(): Promise<MedicineDto[]> {
    try {
      const medicines = await prisma.medicines.findMany({
        select: {
          item_seq: true,
          item_name: true,
        },
      })

      return medicines as MedicineDto[]
    } catch (error) {
      console.error("Error in GetMedicinesUseCase:", error)
      throw new Error("약품 데이터를 가져오는데 실패했습니다.")
    }
  }

  async getUniqueMedicineNames(): Promise<string[]> {
    try {
      const medicines = await this.execute()
      return [...new Set(medicines.map((med) => med.item_name))]
    } catch (error) {
      console.error("Error getting unique medicine names:", error)
      throw new Error("약품명 목록을 가져오는데 실패했습니다.")
    }
  }
}
