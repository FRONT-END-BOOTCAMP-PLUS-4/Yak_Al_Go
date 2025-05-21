"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

// 약 목록 데이터 (실제로는 API에서 가져올 것)
const medicineList = [
  { id: 1, name: "타이레놀" },
  { id: 2, name: "판콜에이" },
  { id: 3, name: "게보린" },
  { id: 4, name: "베아제" },
  { id: 5, name: "훼스탈골드" },
]

export default function SignupStep2Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [selectedMedicines, setSelectedMedicines] = useState<{ id: number; name: string }[]>([])
  const [medicationTimes, setMedicationTimes] = useState<string[]>([])

  // 세션 스토리지에서 1단계 데이터 가져오기
  useEffect(() => {
    const signupDataStr = sessionStorage.getItem("signupData")
    if (signupDataStr) {
      // 1단계 데이터가 있으면 로드
      const signupData = JSON.parse(signupDataStr)
      // 필요한 경우 여기서 데이터를 상태에 설정할 수 있습니다
    }
    // 리다이렉트 로직 제거
  }, [])

  // 약 검색 결과 필터링
  const filteredMedicines = medicineList.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 약 선택 핸들러
  const handleSelectMedicine = (medicine: { id: number; name: string }) => {
    if (!selectedMedicines.some((m) => m.id === medicine.id)) {
      setSelectedMedicines([...selectedMedicines, medicine])
    }
    setSearchTerm("")
    setShowResults(false)
  }

  // 약 삭제 핸들러
  const handleRemoveMedicine = (id: number) => {
    setSelectedMedicines(selectedMedicines.filter((medicine) => medicine.id !== id))
  }

  // 복용 시간 토글 핸들러
  const handleTimeToggle = (time: string) => {
    if (medicationTimes.includes(time)) {
      setMedicationTimes(medicationTimes.filter((t) => t !== time))
    } else {
      setMedicationTimes([...medicationTimes, time])
    }
  }

  // 회원가입 완료 처리
  const handleComplete = () => {
    setIsLoading(true)
    setError("")

    try {
      // 세션 스토리지에서 1단계 데이터 가져오기
      const signupDataStr = sessionStorage.getItem("signupData")
      let signupData = {}

      if (signupDataStr) {
        signupData = JSON.parse(signupDataStr)
      }

      // 2단계 데이터 추가
      const completeData = {
        ...signupData,
        medications: selectedMedicines,
        medicationTimes,
      }

      // 실제 구현 시에는 서버 API를 호출하여 회원가입 처리
      console.log("Signup complete:", completeData)

      // 임시 처리: 로컬 스토리지에 사용자 정보 저장
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const kakaoUserInfoStr = sessionStorage.getItem("kakaoUserInfo")
      const kakaoUserInfo = kakaoUserInfoStr ? JSON.parse(kakaoUserInfoStr) : null

      const newUser = {
        id: kakaoUserInfo?.id || Date.now().toString(),
        ...completeData,
      }
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // 세션 스토리지 정리
      sessionStorage.removeItem("signupData")
      sessionStorage.removeItem("kakaoUserInfo")

      // 완료 페이지로 이동
      router.push("/auth/complete")
    } catch (error) {
      console.error("Signup failed", error)
      setError("회원가입에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-8 rounded-full bg-primary"></div>
              <div className="h-2 w-8 rounded-full bg-primary"></div>
            </div>
          </div>

          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/auth/step1">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <CardTitle className="text-2xl font-bold">회원가입 (2/2)</CardTitle>
          </div>

          <CardDescription>
            {sessionStorage.getItem("signupData")
              ? "복용 중인 약과 복용 시간을 입력해주세요"
              : "1단계를 건너뛰고 직접 접근하셨습니다. 복용 중인 약과 복용 시간을 입력해주세요."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 복용 중인 약 */}
          <div className="space-y-2">
            <Label>복용 중인 약</Label>
            <div className="relative">
              <Input
                placeholder="약 이름을 검색하세요"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowResults(e.target.value.length > 0)
                }}
              />
              {showResults && searchTerm && (
                <div className="absolute w-full mt-1 bg-background border rounded-md shadow-lg z-10">
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((medicine) => (
                      <div
                        key={medicine.id}
                        className="p-2 hover:bg-muted cursor-pointer"
                        onClick={() => handleSelectMedicine(medicine)}
                      >
                        {medicine.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-muted-foreground">검색 결과가 없습니다</div>
                  )}
                </div>
              )}
            </div>
            <div className="mt-2 space-y-2">
              {selectedMedicines.map((medicine) => (
                <div key={medicine.id} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{medicine.name}</span>
                  <Button variant="outline" size="sm" onClick={() => handleRemoveMedicine(medicine.id)}>
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* 복용 시간 */}
          <div className="space-y-2">
            <Label>복용 시간</Label>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 24 }).map((_, i) => {
                const time = `${i.toString().padStart(2, "0")}:00`
                return (
                  <Button
                    key={i}
                    variant={medicationTimes.includes(time) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeToggle(time)}
                  >
                    {time}
                  </Button>
                )
              })}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleComplete} className="w-full" disabled={isLoading}>
            {isLoading ? "처리 중..." : "완료"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
