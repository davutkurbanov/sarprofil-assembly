"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/src/components/AppLayout"
import { QRScanner } from "@/src/components/QRScanner"
import { PhotoAnalyzer } from "@/src/components/PhotoAnalyzer"
import { useAppStore } from "@/src/store/useAppStore"
import { QrCode, Keyboard, Camera, CheckCircle, Sparkles } from "lucide-react"
import "@/src/lib/i18n"

type IdentificationMethod = "qr" | "model" | "photo"

export default function IdentifyPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { setIdentifiedProduct } = useAppStore()
  const [selectedMethod, setSelectedMethod] = useState<IdentificationMethod | null>(null)
  const [modelNumber, setModelNumber] = useState("")
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [isIdentified, setIsIdentified] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [showSuggestion, setShowSuggestion] = useState(false)

  const handleScanQR = () => {
    setSelectedMethod("qr")
    setIsScanning(true)
  }

  const handleQRScanComplete = (code: string) => {
    setIsScanning(false)
    setIdentifiedProduct(code)
    setIsIdentified(true)
  }

  const handleModelSubmit = () => {
    if (modelNumber.trim()) {
      setIdentifiedProduct("SMB-CLST-001")
      setIsIdentified(true)
    }
  }

  const handleSuggestionClick = () => {
    setModelNumber("Sarmobi Closet")
    setShowSuggestion(false)
  }

  const handleModelFocus = () => {
    if (!modelNumber) {
      setShowSuggestion(true)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      setSelectedMethod("photo")
    }
  }

  const handlePhotoAnalysisComplete = (result: "success" | "warning") => {
    if (result === "success") {
      setTimeout(() => {
        setIdentifiedProduct("SMB-CLST-001")
        setIsIdentified(true)
      }, 1000)
    }
  }

  const handleContinue = () => {
    router.push("/overview")
  }

  const handleTryAgain = () => {
    setSelectedMethod(null)
    setModelNumber("")
    setUploadedImage(null)
    setIsScanning(false)
    setIsIdentified(false)
    setShowSuggestion(false)
  }

  if (isIdentified) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <Card className="w-full max-w-md mx-auto shadow-xl border-green-200">
            <CardContent className="pt-6 text-center space-y-6">
              <div className="relative">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">{t("identify.foundProduct")}</h2>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Sarmobi Closet
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Model: SMB-CLST-001</p>
              </div>

              <div className="space-y-3">
                <Button onClick={handleContinue} className="w-full" size="lg">
                  {t("common.continue")}
                </Button>
                <Button onClick={handleTryAgain} variant="outline" className="w-full bg-transparent" size="sm">
                  Try Different Product
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("identify.title")}</h1>
          <p className="text-gray-600 text-lg">Choose a method to identify your product</p>
        </div>

        {/* QR Scanner Active State */}
        {selectedMethod === "qr" && (
          <div className="max-w-md mx-auto">
            <QRScanner onScanComplete={handleQRScanComplete} isScanning={isScanning} />
            <div className="text-center mt-4">
              <Button onClick={handleTryAgain} variant="outline" size="sm">
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        )}

        {/* Photo Analysis Active State */}
        {selectedMethod === "photo" && uploadedImage && (
          <div className="max-w-md mx-auto">
            <PhotoAnalyzer image={uploadedImage} onAnalysisComplete={handlePhotoAnalysisComplete} />
            <div className="text-center mt-4">
              <Button onClick={handleTryAgain} variant="outline" size="sm">
                Try Different Photo
              </Button>
            </div>
          </div>
        )}

        {/* Method Selection */}
        {!selectedMethod && (
          <div className="grid gap-6 md:grid-cols-3">
            {/* QR Code Scan */}
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <QrCode className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{t("identify.scanQR")}</CardTitle>
                <Badge variant="secondary" className="mx-auto">
                  Fastest
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Point your camera at the QR code on your product box
                </p>
                <Button onClick={handleScanQR} className="w-full" size="lg">
                  {t("identify.scanButton")}
                </Button>
              </CardContent>
            </Card>

            {/* Model Number Entry */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Keyboard className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">{t("identify.enterModel")}</CardTitle>
                <Badge variant="outline">Manual</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Label htmlFor="model" className="text-sm font-medium">
                    {t("identify.enterModel")}
                  </Label>
                  <Input
                    id="model"
                    placeholder={t("identify.modelPlaceholder")}
                    value={modelNumber}
                    onChange={(e) => setModelNumber(e.target.value)}
                    onFocus={handleModelFocus}
                    className="mt-1"
                  />

                  {showSuggestion && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-10">
                      <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-3">
                          <button
                            onClick={handleSuggestionClick}
                            className="w-full text-left hover:bg-blue-100 p-2 rounded text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">Suggestion:</span>
                              <span className="text-blue-700">{t("identify.modelSuggestion")}</span>
                            </div>
                          </button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                <Button onClick={handleModelSubmit} className="w-full" size="lg" disabled={!modelNumber.trim()}>
                  {t("common.confirm")}
                </Button>
              </CardContent>
            </Card>

            {/* Photo Upload */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">{t("identify.takePhoto")}</CardTitle>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  BETA
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 text-center">Take a clear photo of your product or packaging</p>
                <div>
                  <Label htmlFor="photo" className="text-sm font-medium">
                    {t("identify.uploadPhoto")}
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500 max-w-2xl mx-auto">
          <p>
            Having trouble? The QR code is usually found on the product box or instruction manual. Model numbers are
            typically printed on a label inside the packaging.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
