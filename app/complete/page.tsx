"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/src/components/AppLayout"
import { ProductCarousel } from "@/src/components/ProductCarousel"
import { AssemblySummary } from "@/src/components/AssemblySummary"
import { ChatBotPanel } from "@/src/components/ChatBotPanel"
import { useAppStore } from "@/src/store/useAppStore"
import { CheckCircle, Sparkles, Package, ShoppingCart, Star, Award, Home, RefreshCw } from "lucide-react"
import productData from "@/src/data/product.json"
import "@/src/lib/i18n"

export default function CompletePage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { completedSteps, resetApp } = useAppStore()

  const totalSteps = productData.steps.length
  const isFullyCompleted = completedSteps.length === totalSteps

  useEffect(() => {
    // Add confetti effect or celebration animation here
    if (isFullyCompleted) {
      document.title = "🎉 Assembly Complete! - Sarmobi"
    }
  }, [isFullyCompleted])

  const handleStartNew = () => {
    resetApp()
    router.push("/")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">{t("complete.title")}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("complete.congratulations")}</p>
          </div>

          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-green-100 text-green-800">
              <Star className="h-4 w-4 mr-2" />
              Assembly Expert
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {completedSteps.length}/{totalSteps} Steps
            </Badge>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Summary */}
          <div className="space-y-6">
            <AssemblySummary />

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button onClick={handleGoHome} variant="outline" className="flex-1 bg-transparent">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button onClick={handleStartNew} variant="outline" className="flex-1 bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                New Assembly
              </Button>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Care Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  {t("complete.careTips")}
                </CardTitle>
                <CardDescription>Keep your furniture in perfect condition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productData.careTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Replacement Parts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  {t("complete.replacementParts")}
                </CardTitle>
                <CardDescription>Order spare parts and hardware when needed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {productData.replacementParts.map((part) => (
                    <div key={part.sku} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{part.name}</p>
                        <p className="text-xs text-gray-600">SKU: {part.sku}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Order
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Pro Tip:</strong> Keep your assembly summary for easy part identification and warranty
                    claims.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("complete.recommendedProducts")}</h2>
            <p className="text-gray-600">Complete your space with these matching pieces</p>
          </div>

          <ProductCarousel title="Perfect Matches" products={productData.upsell} />
        </div>

        {/* Special Offers */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-white" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">Congratulations Bonus!</h3>
                <p className="text-gray-600">Get 15% off your next Sarmobi purchase</p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-blue-100 text-blue-800">
                  Code: ASSEMBLY15
                </Badge>
                <Button className="bg-blue-600 hover:bg-blue-700">Shop Now</Button>
              </div>

              <p className="text-xs text-gray-500">Valid for 30 days. Cannot be combined with other offers.</p>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card>
          <CardHeader>
            <CardTitle>How was your assembly experience?</CardTitle>
            <CardDescription>Your feedback helps us improve our products and instructions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button key={rating} variant="ghost" size="sm" className="p-2">
                  <Star className="h-6 w-6 text-gray-300 hover:text-yellow-500" />
                </Button>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" size="sm" className="bg-transparent">
                Leave Review
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                Share Photo
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ChatBotPanel />
    </AppLayout>
  )
}
