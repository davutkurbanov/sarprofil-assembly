"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"

interface PhotoAnalyzerProps {
  image: File
  onAnalysisComplete: (result: "success" | "warning") => void
}

export function PhotoAnalyzer({ image, onAnalysisComplete }: PhotoAnalyzerProps) {
  const { t } = useTranslation()
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [result, setResult] = useState<"success" | "warning" | null>(null)

  useEffect(() => {
    // Simulate photo analysis
    const timer = setTimeout(() => {
      const analysisResult = Math.random() > 0.3 ? "success" : "warning"
      setResult(analysisResult)
      setIsAnalyzing(false)
      onAnalysisComplete(analysisResult)
    }, 2000)

    return () => clearTimeout(timer)
  }, [image, onAnalysisComplete])

  return (
    <Card className="border-2 border-blue-500">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative">
            <img
              src={URL.createObjectURL(image) || "/placeholder.svg"}
              alt="Product photo"
              className="w-full h-48 object-cover rounded-lg"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Analyzing image...</p>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Result */}
          {result && (
            <div
              className={`p-3 rounded-lg flex items-center gap-3 ${
                result === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-yellow-50 text-yellow-800 border border-yellow-200"
              }`}
            >
              {result === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              )}
              <div className="flex-1">
                <p className="font-medium">
                  {result === "success" ? t("guide.looksGood") : t("guide.checkOrientation")}
                </p>
                {result === "success" ? (
                  <p className="text-sm">Product identified: Sarmobi Closet</p>
                ) : (
                  <p className="text-sm">Try adjusting the angle or lighting</p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
