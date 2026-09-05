import type { ChatTurn } from './chat.store'

const functionUrl = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`
  : null
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isChatConfigured = Boolean(functionUrl && anonKey)

/**
 * Streams the assistant's reply for the given conversation. `onText` is
 * called with each new fragment; the promise resolves when the stream ends.
 * The Anthropic key never reaches the browser: the Edge Function holds it.
 */
export async function streamAssistantReply(
  turns: ChatTurn[],
  onText: (fragment: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (!functionUrl || !anonKey) {
    throw new Error('The assistant is not available right now.')
  }

  const response = await fetch(functionUrl, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({
      messages: turns.map((turn) => ({ role: turn.role, content: turn.content })),
    }),
  })

  if (!response.ok) {
    const detail = await response.json().catch(() => null)
    throw new Error(detail?.error ?? 'The assistant could not answer right now.')
  }
  if (!response.body) throw new Error('No response from the assistant.')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const events = buffer.split('\n\n')
    buffer = events.pop() ?? ''

    for (const event of events) {
      const line = event.split('\n').find((part) => part.startsWith('data:'))
      if (!line) continue
      const data = line.slice(5).trim()
      if (data === '[DONE]') return
      try {
        const parsed = JSON.parse(data) as { text?: string; error?: string }
        if (parsed.error) throw new Error(parsed.error)
        if (parsed.text) onText(parsed.text)
      } catch (error) {
        if (error instanceof Error && error.message && !error.message.startsWith('Unexpected')) throw error
      }
    }
  }
}
