"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import type { PharmacyType } from "@/types/map/types"

interface PharmacyListProps {
  filteredPharmacies: PharmacyType[]
  selectedPharmacyIndex: number | null
  handleSelectPharmacy: (index: number | null) => void
  selectedMedicine: string
  getTodayHours: (pharmacy: PharmacyType) => string
  formatDistance: (lat: number, lon: number) => string
  getPharmacyMedicines: (pharmacy: PharmacyType) => string[]
}

export const PharmacyList: React.FC<PharmacyListProps> = ({
  filteredPharmacies,
  selectedPharmacyIndex,
  handleSelectPharmacy,
  selectedMedicine,
  getTodayHours,
  formatDistance,
  getPharmacyMedicines,
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">약국 목록</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {filteredPharmacies.length > 0 ? (
            filteredPharmacies.map((pharmacy, index) => (
              <Card
                key={pharmacy.hpid}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPharmacyIndex === index ? "border-primary" : ""
                } ${
                  selectedMedicine !== "전체" && getPharmacyMedicines(pharmacy).includes(selectedMedicine)
                    ? "border-primary border-2"
                    : ""
                }`}
                onClick={() => handleSelectPharmacy(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">{pharmacy.duty_name}</h3>
                      <p className="text-sm text-muted-foreground">{pharmacy.duty_addr}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{getTodayHours(pharmacy)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs">
                        {formatDistance(Number(pharmacy.wgs84_lat), Number(pharmacy.wgs84_lon))}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedMedicine !== "전체" &&
                      pharmacy.inventories.slice(0, 3).map((inventory) => (
                        <Badge
                          key={inventory.id}
                          variant="outline"
                          className={`text-xs ${
                            inventory.medicines.item_name === selectedMedicine
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                        >
                          {inventory.medicines.item_name}
                        </Badge>
                      ))}
                    {selectedMedicine !== "전체" && pharmacy.inventories.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{pharmacy.inventories.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
