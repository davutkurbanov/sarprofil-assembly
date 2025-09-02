"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/src/store/useAppStore"
import { Download, Clock, CheckCircle, Users, Wrench } from "lucide-react"
import { useTranslation } from "react-i18next"
import productData from "@/src/data/product.json"

export function AssemblySummary() {
  const { t } = useTranslation()
  const { completedSteps, currentStep } = useAppStore()
  const [isDownloading, setIsDownloading] = useState(false)

  const totalSteps = productData.steps.length
  const completionRate = Math.round((completedSteps.length / totalSteps) * 100)
  const estimatedTimeUsed = Math.round((completedSteps.length / totalSteps) * productData.estimatedTimeMin)

  const generateSummary = () => {
    const summary = `
SARMOBI ASSEMBLY SUMMARY
========================

Product: ${productData.name}
Model: ${productData.id}
Assembly Date: ${new Date().toLocaleDateString()}

COMPLETION STATUS:
- Steps Completed: ${completedSteps.length}/${totalSteps}
- Completion Rate: ${completionRate}%
- Estimated Time Used: ${estimatedTimeUsed} minutes

COMPLETED STEPS:
${productData.steps
  .filter((_, index) => completedSteps.includes(index + 1))
  .map((step, index) => `${index + 1}. ${step.title}`)
  .join("\n")}

TOOLS USED:
${productData.tools.map((tool) => `- ${tool}`).join("\n")}

CARE INSTRUCTIONS:
${productData.careTips.map((tip) => `- ${tip}`).join("\n")}

REPLACEMENT PARTS:
${productData.replacementParts.map((part) => `- ${part.name} (SKU: ${part.sku})`).join("\n")}

Thank you for choosing Sarmobi!
For support, visit: support@sarmobi.com
    `.trim()

    return summary
  }

  const handleDownload = () => {
    setIsDownloading(true)

    // Simulate download process
    setTimeout(() => {
      const summary = generateSummary()
      const blob = new Blob([summary], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `sarmobi-assembly-summary-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setIsDownloading(false)
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Assembly Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Completed</p>
            <p className="font-semibold">
              {completedSteps.length}/{totalSteps}
            </p>
          </div>

          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Time Used</p>
            <p className="font-semibold">~{estimatedTimeUsed}min</p>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Users className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">People</p>
            <p className="font-semibold">{productData.peopleNeeded}</p>
          </div>

          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Wrench className="h-6 w-6 text-orange-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Tools</p>
            <p className="font-semibold">{productData.tools.length}</p>
          </div>
        </div>

        {/* Completion Badge */}
        <div className="text-center">
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-green-100 text-green-800">
            {completionRate}% Complete
          </Badge>
        </div>

        {/* Download Button */}
        <Button onClick={handleDownload} disabled={isDownloading} className="w-full" size="lg">
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Generating Summary..." : t("complete.downloadSummary")}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Summary includes completion status, time used, and care instructions
        </p>
      </CardContent>
    </Card>
  )
}
