"use client"

import { useAppStore } from "@/src/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useTranslation } from "react-i18next"

export function VoiceToggle() {
  const { isVoiceMode, isListening, toggleVoiceMode, setListening } = useAppStore()
  const { t } = useTranslation()

  const handleToggle = () => {
    toggleVoiceMode()
    if (isVoiceMode) {
      setListening(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant={isVoiceMode ? "default" : "outline"} size="sm" onClick={handleToggle} className="gap-2">
        {isVoiceMode ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        <span className="hidden sm:inline">{t("home.voiceMode")}</span>
      </Button>

      {isVoiceMode && isListening && (
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          {t("home.listening")}
        </div>
      )}
    </div>
  )
}
