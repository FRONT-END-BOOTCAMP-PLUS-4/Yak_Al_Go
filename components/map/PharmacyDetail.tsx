"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PharmacyType } from "@/types/map/types";

interface PharmacyDetailProps {
  selectedPharmacy: PharmacyType;
  selectedMedicine: string;
  getTodayHours: (pharmacy: PharmacyType) => string;
  formatWeekdayHours: (
    startTimeStr: string | null | undefined,
    endTimeStr: string | null | undefined
  ) => string;
  onClose: () => void;
}

export const PharmacyDetail: React.FC<PharmacyDetailProps> = ({
  selectedPharmacy,
  selectedMedicine,
  getTodayHours,
  formatWeekdayHours,
  onClose,
}) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 bg-background rounded-lg shadow-lg p-4 border z-50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{selectedPharmacy.duty_name}</h3>
          <p className="text-sm text-muted-foreground">
            {selectedPharmacy.duty_addr}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div>
          <p className="text-sm font-medium">영업 시간</p>
          <p className="text-sm">{getTodayHours(selectedPharmacy)}</p>
        </div>
        <div>
          <p className="text-sm font-medium">연락처</p>
          <p className="text-sm">{selectedPharmacy.duty_tel1 || "정보 없음"}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium">보유 약품</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {selectedPharmacy.inventories.map((inventory) => (
            <Badge
              key={inventory.id}
              variant="outline"
              className={
                inventory.medicines.item_name === selectedMedicine
                  ? "bg-primary text-primary-foreground"
                  : ""
              }
            >
              {inventory.medicines.item_name}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          className="flex-1 gap-1"
          onClick={() => {
            // Open in Kakao Maps or Naver Maps
            const mapUrl = `https://map.kakao.com/link/to/${selectedPharmacy.duty_name},${selectedPharmacy.wgs84_lat},${selectedPharmacy.wgs84_lon}`;
            window.open(mapUrl, "_blank");
          }}
        >
          길찾기
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-1"
          onClick={() => {
            // Call the pharmacy
            if (selectedPharmacy.duty_tel1) {
              window.location.href = `tel:${selectedPharmacy.duty_tel1}`;
            } else {
              alert("전화번호 정보가 없습니다.");
            }
          }}
        >
          <Phone className="h-4 w-4" />
          전화하기
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              상세 정보
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedPharmacy.duty_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">주소</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPharmacy.duty_addr}
                </p>
              </div>
              <div>
                <h4 className="font-medium">연락처</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPharmacy.duty_tel1 || "정보 없음"}
                </p>
              </div>
              <div>
                <h4 className="font-medium">영업 시간</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-xs font-medium">월요일</p>
                    <p className="text-xs text-muted-foreground">
                      {formatWeekdayHours(
                        selectedPharmacy.duty_time1s,
                        selectedPharmacy.duty_time1c
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium">화요일</p>
                    <p className="text-xs text-muted-foreground">
                      {formatWeekdayHours(
                        selectedPharmacy.duty_time2s,
                        selectedPharmacy.duty_time2c
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium">수요일</p>
                    <p className="text-xs text-muted-foreground">
                      {formatWeekdayHours(
                        selectedPharmacy.duty_time3s,
                        selectedPharmacy.duty_time3c
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium">목요일</p>
                    <p className="text-xs text-muted-foreground">
                      {formatWeekdayHours(
                        selectedPharmacy.duty_time4s,
                        selectedPharmacy.duty_time4c
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium">금요일</p>
                    <p className="text-xs text-muted-foreground">
                      {formatWeekdayHours(
                        selectedPharmacy.duty_time5s,
                        selectedPharmacy.duty_time5c
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium">토요일</p>
                    <p className="text-xs text-muted-foreground">
                      {formatWeekdayHours(
                        selectedPharmacy.duty_time6s,
                        selectedPharmacy.duty_time6c
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium">일요일</p>
                    <p className="text-xs text-muted-foreground">
                      {formatWeekdayHours(
                        selectedPharmacy.duty_time7s,
                        selectedPharmacy.duty_time7c
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium">보유 약품</h4>
                <div className="flex flex-wrap gap-1 mt-1 max-h-[150px] overflow-y-auto">
                  {selectedPharmacy.inventories.map((inventory) => (
                    <Badge
                      key={inventory.id}
                      variant={
                        inventory.medicines.item_name === selectedMedicine
                          ? "default"
                          : "outline"
                      }
                      className={
                        inventory.medicines.item_name === selectedMedicine
                          ? "bg-primary"
                          : ""
                      }
                    >
                      {inventory.medicines.item_name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
