import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { MessageCircle, RotateCcw, Send, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOnEscape } from '@/hooks/useOnEscape'
import { isChatConfigured, streamAssistantReply } from './chat.api'
import { useChatStore, type ChatTurn } from './chat.store'
import { ChatMarkdown } from './ChatMarkdown'

const SUGGESTIONS = [
  'Which set should I start with for dark spots?',
  'Magkano ang shipping sa province?',
  'Is the Rejuvenating Set safe if I am pregnant?',
  'How do I check if my product is genuine?',
]

const WELCOME =
  'Hi! I am the Dr. Alvin assistant. Ask me about products, prices, routines, delivery or authenticity. For medical concerns, a dermatologist is always the right call.'

/**
 * Floating "Ask Dr. Alvin" bubble and panel. Mounted once in the root
 * layout; the transcript lives in session storage so it survives navigation.
 */
export function ChatWidget() {
  const { isOpen, hasOpenedOnce, turns, open, close, toggle, append, update, appendText, reset } =
    useChatStore()
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showNudge, setShowNudge] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const location = useLocation()

  useOnEscape(isOpen, close)

  // A single gentle nudge after the visitor has had a moment on the site.
  useEffect(() => {
    if (hasOpenedOnce || !isChatConfigured) return
    const timer = window.setTimeout(() => setShowNudge(true), 12000)
    return () => window.clearTimeout(timer)
  }, [hasOpenedOnce])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [turns, isOpen])

  // Close on navigation on small screens so the page is visible again.
  useEffect(() => {
    if (window.matchMedia('(max-width: 640px)').matches) close()
  }, [location.pathname, close])

  useEffect(() => () => abortRef.current?.abort(), [])

  const send = async (text: string) => {
    const content = text.trim()
    if (!content || isSending) return

    const userTurn: ChatTurn = { id: crypto.randomUUID(), role: 'user', content }
    const assistantTurn: ChatTurn = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      isStreaming: true,
    }
    append(userTurn)
    append(assistantTurn)
    setDraft('')
    setIsSending(true)

    const controller = new AbortController()
    abortRef.current = controller
    const history = [...turns.filter((turn) => !turn.isError && turn.content), userTurn]

    try {
      await streamAssistantReply(
        history,
        (fragment) => appendText(assistantTurn.id, fragment),
        controller.signal,
      )
      update(assistantTurn.id, { isStreaming: false })
    } catch (error) {
      if (controller.signal.aborted) return
      update(assistantTurn.id, {
        isStreaming: false,
        isError: true,
        content: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSending(false)
    }
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    void send(draft)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void send(draft)
    }
  }

  if (!isChatConfigured) return null

  return (
    <>
      {/* Launcher */}
      <div className="bottom-widget fixed bottom-5 right-5 z-40 flex items-end gap-3 sm:bottom-6 sm:right-6">
        {showNudge && !isOpen && (
          <button
            type="button"
            onClick={() => {
              setShowNudge(false)
              open()
            }}
            className="rise hidden max-w-[15rem] rounded-card border border-rule bg-white px-4 py-3 text-left text-[0.875rem] leading-snug text-ink shadow-[0_18px_40px_-20px_rgba(30,26,56,0.45)] sm:block"
          >
            <span className="block font-medium">Not sure where to start?</span>
            <span className="text-ink-soft">Ask me which set suits your skin.</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setShowNudge(false)
            toggle()
          }}
          aria-expanded={isOpen}
          aria-controls="ask-dr-alvin"
          aria-label={isOpen ? 'Close the assistant' : 'Ask Dr. Alvin'}
          className={cn(
            'relative grid size-14 place-items-center rounded-full bg-violet text-white shadow-[0_18px_40px_-14px_rgba(75,46,212,0.7)] transition-[transform,background-color] duration-300 ease-out-quint hover:scale-105 hover:bg-violet-deep',
            !hasOpenedOnce && 'play-pulse',
          )}
        >
          {isOpen ? <X size={22} strokeWidth={2} /> : <MessageCircle size={24} strokeWidth={2} />}
        </button>
      </div>

      {/* Panel */}
      <section
        id="ask-dr-alvin"
        role="dialog"
        aria-label="Ask Dr. Alvin"
        aria-hidden={!isOpen}
        className={cn(
          'fixed z-40 flex flex-col overflow-hidden border border-rule bg-paper shadow-[0_32px_80px_-24px_rgba(30,26,56,0.5)] transition-[opacity,transform] duration-300 ease-out-quint',
          'inset-x-3 bottom-24 max-h-[min(40rem,calc(100svh-7.5rem))] rounded-card sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[24rem]',
          isOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <header className="flex items-center gap-3 border-b border-rule bg-white px-4 py-3">
          <span className="grid size-9 place-items-center rounded-full bg-violet-wash text-violet">
            <Sparkles size={18} strokeWidth={1.75} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.9375rem] font-semibold leading-tight">Ask Dr. Alvin</p>
            <p className="text-[0.75rem] text-ink-faint">AI assistant. Not medical advice.</p>
          </div>
          {turns.length > 0 && (
            <button
              type="button"
              onClick={() => {
                abortRef.current?.abort()
                setIsSending(false)
                reset()
              }}
              aria-label="Start a new conversation"
              className="grid size-9 place-items-center rounded-[3px] text-ink-faint transition-colors hover:bg-chalk hover:text-ink"
            >
              <RotateCcw size={16} strokeWidth={1.75} />
            </button>
          )}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-[3px] text-ink-faint transition-colors hover:bg-chalk hover:text-ink"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </header>

        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
          <Bubble role="assistant">
            <p>{WELCOME}</p>
          </Bubble>

          {turns.length === 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void send(suggestion)}
                  className="rounded-full border border-rule-strong bg-white px-3 py-1.5 text-left text-[0.8125rem] text-ink-soft transition-colors hover:border-violet hover:text-violet"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {turns.map((turn) => (
            <Bubble key={turn.id} role={turn.role} isError={turn.isError}>
              {turn.role === 'assistant' ? (
                turn.content ? (
                  <ChatMarkdown text={turn.content} />
                ) : (
                  <TypingDots />
                )
              ) : (
                <p className="whitespace-pre-wrap">{turn.content}</p>
              )}
            </Bubble>
          ))}
        </div>

        <form onSubmit={onSubmit} className="border-t border-rule bg-white p-3">
          <div className="flex items-end gap-2 rounded-card border border-rule-strong bg-paper px-3 py-2 focus-within:border-violet">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              maxLength={1500}
              placeholder="Type your question…"
              aria-label="Your question"
              className="max-h-32 min-h-[1.75rem] flex-1 resize-none bg-transparent text-[0.9375rem] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
            />
            <button
              type="submit"
              disabled={!draft.trim() || isSending}
              aria-label="Send"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-marigold text-white transition-[background-color,transform] hover:bg-marigold-deep active:scale-95 disabled:opacity-40"
            >
              <Send size={16} strokeWidth={2} />
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

function Bubble({
  role,
  isError,
  children,
}: {
  role: ChatTurn['role']
  isError?: boolean
  children: ReactNode
}) {
  return (
    <div className={cn('mt-3 flex first:mt-0', role === 'user' ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[0.9375rem] leading-relaxed',
          role === 'user'
            ? 'rounded-br-md bg-ink text-paper'
            : 'rounded-bl-md border border-rule bg-white text-ink-soft',
          isError && 'border-alert/40 bg-alert/5 text-alert',
        )}
      >
        {children}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="The assistant is typing">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="size-1.5 animate-bounce rounded-full bg-ink-faint"
          style={{ animationDelay: `${index * 140}ms` }}
        />
      ))}
    </span>
  )
}
