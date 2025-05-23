"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

import { useSession } from "next-auth/react"

export default function SignupStep1Page() {
  const router = useRouter()
  const [userType, setUserType] = useState<"general" | "pharmacist">("general")
  const [error, setError] = useState("")

  const { data: session, status } = useSession()
  

  console.log("Session data:", session)

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    nickname: "",
    age: "",
    healthConditions: [] as string[],
    licenseNumber: "",
    pharmacyId: "",
    pharmacyName: "",
    pharmacyAddress: "",
  })



  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 체크박스 핸들러
  const handleCheckboxChange = (value: string, field: string) => {
    setFormData((prev) => {
      const currentValues = prev[field as keyof typeof prev] as string[]
      return {
        ...prev,
        [field]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value]
      }
    })
  }

  // 셀렉트 핸들러
  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // 다음 단계로 이동
  const handleNextStep = () => {
    // 폼 데이터 유효성 검사
    if (userType === "general") {
      if (!formData.nickname || !formData.age) {
        setError("모든 필수 항목을 입력해주세요.")
        return
      }
    } else {
      if (!formData.licenseNumber || !formData.pharmacyId || !formData.pharmacyName || !formData.pharmacyAddress) {
        setError("모든 필수 항목을 입력해주세요.")
        return
      }
    }

    // 세션 스토리지에 폼 데이터 저장
    sessionStorage.setItem(
      "signupData",
      JSON.stringify({
        ...formData,
        userType,
      }),
    )

    // 일반 회원인 경우에만 2단계로 이동, 약사는 바로 완료
    if (userType === "general") {
      router.push("/auth/step2")
    } else {
      router.push("/auth/complete")
    }
  }
if (status === "loading") {
    return <div>Loading...</div>  
  }
  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            {userType === "general" ? (
              // General user has 2 steps
              <div className="flex items-center space-x-2">
                <div className="h-2 w-8 rounded-full bg-primary"/>
                <div className="h-2 w-8 rounded-full bg-gray-300" />
              </div>
            ) : (
              // Pharmacist has only 1 step
              <div className="flex items-center space-x-2">
                <div className="h-2 w-8 rounded-full bg-primary"/>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/auth">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <CardTitle className="text-2xl font-bold"> 
              {/* userType정의의 */}
              {userType === "general" ? "회원가입 (1/2)" : "회원가입 (1/1)"}
            </CardTitle>
          </div>

        </CardHeader>
        <CardContent>
          <Tabs defaultValue={userType} onValueChange={(value) => setUserType(value as "general" | "pharmacist")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">일반 회원</TabsTrigger>
              <TabsTrigger value="pharmacist">약사</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              {/* 일반 회원 폼 */}
              <div className="space-y-2">
                <Label htmlFor="age">나이</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="나이를 입력하세요"
                  value={formData.age} // 값 초기화화
                  onChange={handleInputChange}
                  required // 필수 입력
                />
              </div>
              <div className="space-y-2">
                <Label>건강 상태</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pregnant"
                      checked={formData.healthConditions.includes("pregnant")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleCheckboxChange("pregnant", "healthConditions")
                        } else {
                          handleCheckboxChange("pregnant", "healthConditions")
                        }
                      }}
                    />
                    <Label htmlFor="pregnant">임산부</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allergy"
                      checked={formData.healthConditions.includes("allergy")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleCheckboxChange("allergy", "healthConditions")
                        } else {
                          handleCheckboxChange("allergy", "healthConditions")
                        }
                      }}
                    />
                    <Label htmlFor="allergy">알레르기</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="conditions">질병 정보</Label>
                <Select onValueChange={(value) => handleSelectChange(value, "healthConditions")}>
                  <SelectTrigger id="conditions">
                    <SelectValue placeholder="질병 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hypertension">고혈압</SelectItem>
                    <SelectItem value="diabetes">당뇨</SelectItem>
                    <SelectItem value="heart">심장질환</SelectItem>
                    <SelectItem value="liver">간질환</SelectItem>
                    <SelectItem value="kidney">신장질환</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="pharmacist" className="space-y-4 mt-4">
              {/* 약사 회원 폼 */}
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">약사 면허 번호</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  placeholder="약사 면허 번호를 입력하세요"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pharmacyId">약국 ID (HPID)</Label>
                <Input
                  id="pharmacyId"
                  name="pharmacyId"
                  placeholder="약국 ID를 입력하세요"
                  value={formData.pharmacyId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pharmacyName">약국명</Label>
                <Input
                  id="pharmacyName"
                  name="pharmacyName"
                  placeholder="약국명을 입력하세요"
                  value={formData.pharmacyName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pharmacyAddress">약국 주소</Label>
                <Input
                  id="pharmacyAddress"
                  name="pharmacyAddress"
                  placeholder="약국 주소를 입력하세요"
                  value={formData.pharmacyAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </TabsContent>
          </Tabs>

          {error && <p className="text-sm text-destructive mt-4">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleNextStep} className="w-full">
            {userType === "general" ? "다음" : "완료"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
