"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { VoiceToggle } from "./VoiceToggle"
import { ArrowLeft, HelpCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useAppStore } from "@/src/store/useAppStore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation()
  const { language } = useAppStore()

  const showBackButton = pathname !== "/"
  const isRTL = language === "ar"

  const handleBack = () => {
    if (pathname === "/identify") {
      router.push("/")
    } else if (pathname === "/overview") {
      router.push("/identify")
    } else if (pathname === "/guide") {
      router.push("/overview")
    } else if (pathname === "/complete") {
      router.push("/guide")
    } else {
      router.back()
    }
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={handleBack} className={`p-2 ${isRTL ? "rotate-180" : ""}`}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-gray-900">Sarmobi</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <VoiceToggle />
        <LanguageSwitcher />

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Support</DialogTitle>
              <DialogDescription>Need help with your assembly? Choose an option below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Chat with AI Assistant
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Call Support: 1-800-SARMOBI
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Email: support@sarmobi.com
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
