"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppLayout } from "@/src/components/AppLayout"
import { ThreeDViewer } from "@/src/components/ThreeDViewer"
import { VideoPlayer } from "@/src/components/VideoPlayer"
import { HelpDrawer } from "@/src/components/HelpDrawer"
import { ChatBot } from "@/src/components/ChatBot"
import { ChatBotPanel } from "@/src/components/ChatBotPanel"
import { useAppStore } from "@/src/store/useAppStore"
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react"
import productData from "@/src/data/product.json"
import "@/src/lib/i18n"

export default function GuidePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const {
    currentStep,
    completedSteps,
    setCurrentStep,
    completeStep,
    activeMediaTab,
    setActiveMediaTab,
    isExplodedView,
    toggleExplodedView,
    isChatOpen,
    toggleChat,
  } = useAppStore()

  // Set 3D as default tab if not already set
  useEffect(() => {
    if (!activeMediaTab || !["3d", "video", "image"].includes(activeMediaTab)) {
      setActiveMediaTab("3d")
    }
  }, [activeMediaTab, setActiveMediaTab])

  const [isStepCompleted, setIsStepCompleted] = useState(false)

  const currentStepData = productData.steps[currentStep - 1]
  const isLastStep = currentStep === productData.steps.length
  const isFirstStep = currentStep === 1

  useEffect(() => {
    setIsStepCompleted(completedSteps.includes(currentStep))
  }, [completedSteps, currentStep])

  useEffect(() => {
    if (searchParams.get("chat") === "open") {
      if (!isChatOpen) {
        toggleChat()
      }
    }
  }, [searchParams, isChatOpen, toggleChat])

  const handleNextStep = () => {
    if (!isStepCompleted) {
      completeStep(currentStep)
      setIsStepCompleted(true)
    }

    if (isLastStep) {
      router.push("/complete")
    } else {
      setCurrentStep(currentStep + 1)
      setIsStepCompleted(false)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setIsStepCompleted(completedSteps.includes(currentStep - 1))
    }
  }

  const handleAIAssistant = () => {
    toggleChat()
  }

  if (!currentStepData) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p>Step not found</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-4">
        <div className={`grid gap-6 ${isChatOpen ? "grid-cols-1 lg:grid-cols-4" : "grid-cols-1 lg:grid-cols-3"}`}>
          {/* Left Column - Step Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Progress */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-sm">
                    {t("guide.stepOf", { current: currentStep, total: productData.steps.length })}
                  </Badge>
                  {isStepCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h2 className="text-xl font-bold">{currentStepData.title}</h2>
                  <p className="text-gray-600">{currentStepData.instruction}</p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedSteps.length / productData.steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            {currentStepData.tips && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentStepData.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Safety Warnings */}
            {currentStepData.safety && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="h-5 w-5" />
                    Safety
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentStepData.safety.map((warning, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-orange-800">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex gap-2">
              <Button
                onClick={handlePreviousStep}
                disabled={isFirstStep}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("common.back")}
              </Button>
              <HelpDrawer
                currentStep={currentStep}
                totalSteps={productData.steps.length}
                onAIAssistant={handleAIAssistant}
              />
            </div>

            <Button onClick={handleNextStep} className="w-full" size="lg">
              {isLastStep ? "Complete Assembly" : t("common.done")}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Center Column - Media */}
          <div className={isChatOpen ? "lg:col-span-2" : "lg:col-span-2"}>
            <Card>
              <CardHeader>
                <Tabs value={activeMediaTab} onValueChange={(value) => setActiveMediaTab(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="3d">{t("guide.tabs.3d")}</TabsTrigger>
                    <TabsTrigger value="video">{t("guide.tabs.video")}</TabsTrigger>
                    <TabsTrigger value="image">{t("guide.tabs.image")}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <Tabs value={activeMediaTab}>
                  <TabsContent value="3d" className="mt-0">
                    <ThreeDViewer
                      stepData={currentStepData.threeD}
                      isExploded={isExplodedView}
                      onToggleExploded={toggleExplodedView}
                    />
                  </TabsContent>

                  <TabsContent value="video" className="mt-0">
                    <VideoPlayer src={currentStepData.video || "/placeholder.mp4"} poster="/video-thumbnail.png" />
                  </TabsContent>

                  <TabsContent value="image" className="mt-0">
                    <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                      <img
                        src={currentStepData.image || "/placeholder.svg?height=400&width=600&query=assembly step"}
                        alt={currentStepData.title}
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chat (when open on desktop) */}
          {isChatOpen && (
            <div className="lg:col-span-1 hidden lg:block">
              <ChatBot onClose={toggleChat} className="h-[600px]" />
            </div>
          )}
        </div>
      </div>

      <ChatBotPanel />
    </AppLayout>
  )
}
