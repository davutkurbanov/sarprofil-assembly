"use client"

import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/src/components/AppLayout"
import { ChatBotPanel } from "@/src/components/ChatBotPanel"
import { Download, Clock, Users, Wrench, MessageCircle, Sparkles, Package } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import productData from "@/src/data/product.json"
import "@/src/lib/i18n"

export default function OverviewPage() {
  const router = useRouter()
  const { t } = useTranslation()

  const handleStartAssembly = () => {
    router.push("/guide")
  }

  const handleOpenChatbot = () => {
    router.push("/guide?chat=open")
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Product Hero */}
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{productData.name}</CardTitle>
                <CardDescription className="text-lg">Model: {productData.id}</CardDescription>
              </div>
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Manual Download */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{t("overview.downloadManual")}</span>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{t("overview.estimatedTime")}</p>
                <p className="font-semibold">{productData.estimatedTimeMin} min</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Wrench className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{t("overview.complexity")}</p>
                <Badge variant="secondary">{productData.complexity}</Badge>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{t("overview.peopleNeeded")}</p>
                <p className="font-semibold">{productData.peopleNeeded}</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Wrench className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{t("overview.requiredTools")}</p>
                <p className="text-xs">{productData.tools.length} tools</p>
              </div>
            </div>

            {/* Required Tools */}
            <div>
              <h3 className="font-semibold mb-3">{t("overview.requiredTools")}:</h3>
              <div className="flex flex-wrap gap-2">
                {productData.tools.map((tool, index) => (
                  <Badge key={index} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleStartAssembly} className="flex-1" size="lg">
                {t("overview.startAssembly")}
              </Button>
              <Button onClick={handleOpenChatbot} variant="outline" className="flex-1 bg-transparent" size="lg">
                <MessageCircle className="h-4 w-4 mr-2" />
                {t("overview.openChatbot")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-3 p-4">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{t("overview.careTips")}</h3>
                    <p className="text-sm text-gray-600">Maintenance and cleaning guide</p>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("overview.careTips")}</DialogTitle>
                <DialogDescription>Keep your furniture in perfect condition with these tips.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {productData.careTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-3 p-4">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{t("overview.replacementParts")}</h3>
                    <p className="text-sm text-gray-600">Order spare parts and hardware</p>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("overview.replacementParts")}</DialogTitle>
                <DialogDescription>Order replacement parts for your Sarmobi Closet.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {productData.replacementParts.map((part) => (
                  <div key={part.sku} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{part.name}</p>
                      <p className="text-sm text-gray-600">SKU: {part.sku}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ChatBotPanel />
    </AppLayout>
  )
}
