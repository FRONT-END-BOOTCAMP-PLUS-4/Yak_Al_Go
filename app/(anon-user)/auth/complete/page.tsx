"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function SignupCompletePage() {
  const router = useRouter()

  // 3초 후 메인 페이지로 자동 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">회원가입 완료</CardTitle>
          <CardDescription className="text-center">
            약알고 서비스 회원가입이 완료되었습니다. 다양한 기능을 이용해보세요!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>잠시 후 메인 페이지로 이동합니다...</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/")} className="w-full">
            메인 페이지로 이동
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
