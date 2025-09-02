"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppStore } from "@/src/store/useAppStore"
import { useTranslation } from "react-i18next"
import { Send, Bot, User, ImageIcon, Video, Box, HelpCircle } from "lucide-react"
import productData from "@/src/data/product.json"

interface ChatBotProps {
  onClose?: () => void
  className?: string
}

export function ChatBot({ onClose, className = "" }: ChatBotProps) {
  const { t, i18n } = useTranslation()
  const { currentStep, completedSteps, chatMessages, addChatMessage, setActiveMediaTab, language } = useAppStore()

  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentStepData = productData.steps[currentStep - 1]

  useEffect(() => {
    // Initialize chat with welcome message if no messages exist
    if (chatMessages.length === 0) {
      addChatMessage({
        type: "bot",
        content: t("chatbot.welcome"),
      })
    }
  }, [chatMessages.length, addChatMessage, t])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [chatMessages])

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    // Step-specific responses
    if (message.includes("step") || message.includes("current")) {
      const progress = t("chatbot.progress", { step: currentStep, total: productData.steps.length })
      const instruction = currentStepData?.instruction || ""
      const translatedInstruction = language !== "en" ? `\n\n${t("guide.tabs.image")}: ${instruction}` : ""

      return `${progress}\n\n${instruction}${translatedInstruction}`
    }

    // Help with specific parts
    if (message.includes("panel") || message.includes("base") || message.includes("shelf")) {
      return `For this step, focus on: ${currentStepData?.threeD.highlight.join(", ") || "the highlighted parts"}. ${currentStepData?.tips?.[0] || "Take your time and follow the instructions carefully."}`
    }

    // Tool-related questions
    if (message.includes("tool") || message.includes("screw")) {
      const tools = productData.tools.join(", ")
      return `You'll need these tools: ${tools}. Make sure you have everything ready before starting.`
    }

    // Time-related questions
    if (message.includes("time") || message.includes("long")) {
      return `This assembly typically takes ${productData.estimatedTimeMin} minutes total. Step ${currentStep} should take about ${Math.ceil(productData.estimatedTimeMin / productData.steps.length)} minutes.`
    }

    // Difficulty questions
    if (message.includes("hard") || message.includes("difficult") || message.includes("stuck")) {
      const tips = currentStepData?.tips || []
      if (tips.length > 0) {
        return `Don't worry! Here are some tips for this step:\n${tips.map((tip, i) => `${i + 1}. ${tip}`).join("\n")}`
      }
      return "This step can be tricky, but take it slow. Would you like me to show you the video or 3D view?"
    }

    // Media requests
    if (message.includes("video") || message.includes("show")) {
      return "I can help you view different media for this step. Use the tabs above to switch between Image, Video, and 3D views."
    }

    // Safety questions
    if (message.includes("safe") || message.includes("danger")) {
      const safety = currentStepData?.safety || []
      if (safety.length > 0) {
        return `Safety reminders:\n${safety.map((item, i) => `${i + 1}. ${item}`).join("\n")}`
      }
      return "Always follow safety guidelines. If you're unsure about anything, don't hesitate to contact human support."
    }

    // Default helpful response
    const responses = [
      `I'm here to help with Step ${currentStep}! ${currentStepData?.instruction || ""}`,
      `You're doing great! ${completedSteps.length} steps completed so far.`,
      "Need more specific help? Try asking about tools, safety, or describing what you're having trouble with.",
      "I can help explain the current step, show you tips, or guide you to the right media view.",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    // Add user message
    addChatMessage({
      type: "user",
      content: inputMessage,
    })

    const userMsg = inputMessage
    setInputMessage("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse = generateBotResponse(userMsg)
        addChatMessage({
          type: "bot",
          content: botResponse,
        })
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "show-image":
        setActiveMediaTab("image")
        addChatMessage({
          type: "bot",
          content: "Switched to image view. You can see the visual guide for this step above.",
        })
        break
      case "show-video":
        setActiveMediaTab("video")
        addChatMessage({
          type: "bot",
          content: "Switched to video view. The video will show you exactly how to complete this step.",
        })
        break
      case "show-3d":
        setActiveMediaTab("3d")
        addChatMessage({
          type: "bot",
          content: "Switched to 3D view. You can rotate and explore the model to better understand the assembly.",
        })
        break
      case "tips":
        const tips = currentStepData?.tips || []
        if (tips.length > 0) {
          addChatMessage({
            type: "bot",
            content: `Here are the tips for Step ${currentStep}:\n${tips.map((tip, i) => `${i + 1}. ${tip}`).join("\n")}`,
          })
        }
        break
    }
  }

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Assistant
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Step {currentStep} of {productData.steps.length}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {completedSteps.length} completed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "bot" && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {message.type === "user" && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="flex flex-wrap gap-2 mb-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("show-image")}
              className="text-xs bg-transparent"
            >
              <ImageIcon className="h-3 w-3 mr-1" />
              Show Image
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("show-video")}
              className="text-xs bg-transparent"
            >
              <Video className="h-3 w-3 mr-1" />
              Show Video
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("show-3d")}
              className="text-xs bg-transparent"
            >
              <Box className="h-3 w-3 mr-1" />
              Show 3D
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleQuickAction("tips")}
              className="text-xs bg-transparent"
            >
              <HelpCircle className="h-3 w-3 mr-1" />
              Tips
            </Button>
          </div>
        </div>

        {/* Input */}
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about this step..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
