"use client"

import { useAppStore } from "@/src/store/useAppStore"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
] as const

export function LanguageSwitcher() {
  const { language, setLanguage } = useAppStore()
  const { i18n } = useTranslation()

  useEffect(() => {
    i18n.changeLanguage(language)
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language, i18n])

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage?.name}</span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)} className="gap-2">
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
