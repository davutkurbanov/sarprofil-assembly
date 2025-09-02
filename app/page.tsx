"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/src/components/AppLayout"
import { useAppStore } from "@/src/store/useAppStore"
import "@/src/lib/i18n"

export default function HomePage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { resetApp } = useAppStore()

  useEffect(() => {
    resetApp()
  }, [resetApp])

  const handleStart = () => {
    router.push("/identify")
  }

  return (
    <AppLayout>
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="w-full max-w-md mx-auto shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">{t("home.title")}</CardTitle>
            <CardDescription className="text-lg text-gray-600">{t("home.subtitle")}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button onClick={handleStart} className="w-full h-12 text-lg font-semibold" size="lg">
              {t("home.startButton")}
            </Button>

            <p className="text-sm text-gray-500 text-center">{t("home.demoNote")}</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
