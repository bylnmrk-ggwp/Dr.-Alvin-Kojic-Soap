import { supabase } from '@/lib/supabase/client'
import type { ContactValues } from '@/lib/validation/schemas'

export async function submitContactMessage(values: ContactValues): Promise<void> {
  if (!supabase) {
    await new Promise((resolve) => window.setTimeout(resolve, 500))
    return
  }

  const { error } = await supabase.from('contact_messages').insert({
    name: values.name,
    email: values.email,
    topic: values.topic,
    message: values.message,
  })

  if (error) throw new Error(`Could not send your message: ${error.message}`)
}
