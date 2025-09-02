"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChatBot } from "./ChatBot"
import { MessageCircle, X } from "lucide-react"
import { useAppStore } from "@/src/store/useAppStore"

export function ChatBotPanel() {
  const { isChatOpen, toggleChat } = useAppStore()
  const [isMinimized, setIsMinimized] = useState(false)

  if (!isChatOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={toggleChat}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96 sm:w-96 sm:h-[500px]">
      {isMinimized ? (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setIsMinimized(false)}
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
            size="lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-xl border h-full">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium">AI Assistant</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)}>
                −
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="h-[calc(100%-60px)]">
            <ChatBot className="h-full border-0 shadow-none" />
          </div>
        </div>
      )}
    </div>
  )
}
