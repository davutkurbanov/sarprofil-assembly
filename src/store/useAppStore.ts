import { create } from "zustand"

export type Language = "en" | "tr" | "ar" | "ru"

export interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

export interface AppState {
  // UI State
  language: Language
  isVoiceMode: boolean
  isListening: boolean

  // Product State
  identifiedProduct: string | null
  currentStep: number
  completedSteps: number[]

  // Chat State
  chatMessages: ChatMessage[]
  isChatOpen: boolean

  // Media State
  activeMediaTab: "image" | "video" | "3d"
  isExplodedView: boolean

  // Actions
  setLanguage: (language: Language) => void
  toggleVoiceMode: () => void
  setListening: (listening: boolean) => void
  setIdentifiedProduct: (product: string) => void
  setCurrentStep: (step: number) => void
  completeStep: (step: number) => void
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  toggleChat: () => void
  setActiveMediaTab: (tab: "image" | "video" | "3d") => void
  toggleExplodedView: () => void
  resetApp: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  language: "en",
  isVoiceMode: false,
  isListening: false,
  identifiedProduct: null,
  currentStep: 1,
  completedSteps: [],
  chatMessages: [],
  isChatOpen: false,
  activeMediaTab: "3d",
  isExplodedView: false,

  // Actions
  setLanguage: (language) => set({ language }),

  toggleVoiceMode: () =>
    set((state) => ({
      isVoiceMode: !state.isVoiceMode,
      isListening: false,
    })),

  setListening: (listening) => set({ isListening: listening }),

  setIdentifiedProduct: (product) => set({ identifiedProduct: product }),

  setCurrentStep: (step) => set({ currentStep: step }),

  completeStep: (step) =>
    set((state) => ({
      completedSteps: [...state.completedSteps, step].filter((s, i, arr) => arr.indexOf(s) === i),
    })),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        },
      ],
    })),

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  setActiveMediaTab: (tab) => set({ activeMediaTab: tab }),

  toggleExplodedView: () => set((state) => ({ isExplodedView: !state.isExplodedView })),

  resetApp: () =>
    set({
      identifiedProduct: null,
      currentStep: 1,
      completedSteps: [],
      chatMessages: [],
      isChatOpen: false,
      activeMediaTab: "3d",
      isExplodedView: false,
      isListening: false,
    }),
}))
