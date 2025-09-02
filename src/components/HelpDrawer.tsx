"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle, MessageCircle, Phone, Camera, CheckCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { PhotoAnalyzer } from "./PhotoAnalyzer"

interface HelpDrawerProps {
  currentStep: number
  totalSteps: number
  onAIAssistant: () => void
}

export function HelpDrawer({ currentStep, totalSteps, onAIAssistant }: HelpDrawerProps) {
  const { t } = useTranslation()
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [isEscalated, setIsEscalated] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredTime: "",
    issue: "",
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedImage(file)
    }
  }

  const handlePhotoAnalysis = (result: "success" | "warning") => {
    // Handle photo analysis result
  }

  const handleEscalation = () => {
    setIsEscalated(true)
    // In a real app, this would send the form data to support
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <HelpCircle className="h-4 w-4" />
          {t("common.help")}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Need Help?</SheetTitle>
          <SheetDescription>
            Get assistance with Step {currentStep} of {totalSteps}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {/* AI Assistant */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                {t("guide.aiAssistant")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Get instant help with simplified instructions and tips for your current step.
              </p>
              <Button onClick={onAIAssistant} className="w-full">
                Chat with AI Assistant
              </Button>
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5 text-purple-600" />
                {t("guide.uploadPhoto")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Upload a photo of your current progress for personalized guidance.
              </p>

              <div>
                <Label htmlFor="help-photo">Upload Photo</Label>
                <Input
                  id="help-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
              </div>

              {uploadedImage && <PhotoAnalyzer image={uploadedImage} onAnalysisComplete={handlePhotoAnalysis} />}
            </CardContent>
          </Card>

          {/* Human Support */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                {t("guide.escalateHuman")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isEscalated ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full bg-transparent">
                      Contact Support Representative
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact Support</DialogTitle>
                      <DialogDescription>
                        A support representative will contact you to help with your assembly.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="preferred-time">Preferred Contact Time</Label>
                        <Input
                          id="preferred-time"
                          placeholder="e.g., Tomorrow morning, This evening"
                          value={formData.preferredTime}
                          onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="issue">Describe Your Issue</Label>
                        <Textarea
                          id="issue"
                          placeholder="What specific problem are you having?"
                          value={formData.issue}
                          onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                        />
                      </div>

                      <Button onClick={handleEscalation} className="w-full">
                        Submit Support Request
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="text-center space-y-3">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <div>
                    <p className="font-medium text-green-800">Request Submitted!</p>
                    <p className="text-sm text-gray-600">A support representative will contact you shortly.</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Ticket #SR-{Date.now().toString().slice(-6)}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
