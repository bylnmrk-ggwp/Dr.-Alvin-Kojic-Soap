import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface ChatTurn {
  id: string
  role: 'user' | 'assistant'
  content: string
  /** True while the assistant's reply is still streaming in. */
  isStreaming?: boolean
  isError?: boolean
}

interface ChatState {
  isOpen: boolean
  /** Whether the bubble has been noticed; drives the one-time nudge. */
  hasOpenedOnce: boolean
  turns: ChatTurn[]
  open: () => void
  close: () => void
  toggle: () => void
  append: (turn: ChatTurn) => void
  update: (id: string, patch: Partial<ChatTurn>) => void
  appendText: (id: string, fragment: string) => void
  reset: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      hasOpenedOnce: false,
      turns: [],
      open: () => set({ isOpen: true, hasOpenedOnce: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen, hasOpenedOnce: true })),
      append: (turn) => set((state) => ({ turns: [...state.turns, turn] })),
      update: (id, patch) =>
        set((state) => ({ turns: state.turns.map((turn) => (turn.id === id ? { ...turn, ...patch } : turn)) })),
      appendText: (id, fragment) =>
        set((state) => ({
          turns: state.turns.map((turn) => (turn.id === id ? { ...turn, content: turn.content + fragment } : turn)),
        })),
      reset: () => set({ turns: [] }),
    }),
    {
      name: 'dr-alvin-chat',
      // Keep the transcript for the session only; the open state should not persist across reloads.
      storage: createJSONStorage(() => window.sessionStorage),
      partialize: (state) => ({
        turns: state.turns.filter((turn) => !turn.isStreaming),
        hasOpenedOnce: state.hasOpenedOnce,
      }),
    },
  ),
)
