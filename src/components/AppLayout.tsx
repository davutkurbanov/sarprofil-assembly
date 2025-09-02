"use client"

import type React from "react"

import { useAppStore } from "@/src/store/useAppStore"
import { AppHeader } from "./AppHeader"
import { useEffect } from "react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { language } = useAppStore()

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [language])

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${language === "ar" ? "rtl" : "ltr"}`}>
      <AppHeader />
      <main className="pb-4">{children}</main>
    </div>
  )
}
