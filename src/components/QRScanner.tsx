"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { QrCode, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"

interface QRScannerProps {
  onScanComplete: (code: string) => void
  isScanning: boolean
}

export function QRScanner({ onScanComplete, isScanning }: QRScannerProps) {
  const { t } = useTranslation()
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isScanning) {
      setScanProgress(0)
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            return 100
          }
          return prev + 10
        })
      }, 100)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isScanning])

  useEffect(() => {
    if (scanProgress >= 100 && isScanning) {
      onScanComplete("SMB-CLST-001")
    }
  }, [scanProgress, isScanning, onScanComplete])

  return (
    <div className="space-y-4">
      {isScanning && (
        <Card className="border-2 border-blue-500 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 mx-auto border-2 border-blue-500 rounded-lg flex items-center justify-center bg-white">
                  <QrCode className="h-16 w-16 text-blue-600" />
                </div>
                {/* Scanning animation overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-1 bg-red-500 animate-pulse" style={{ top: `${scanProgress}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Scanning QR Code...</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">Hold steady and ensure good lighting</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
