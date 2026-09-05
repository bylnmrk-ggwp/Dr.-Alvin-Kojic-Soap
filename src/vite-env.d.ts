/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_EMAILJS_PUBLIC_KEY?: string
  readonly VITE_EMAILJS_SERVICE_ID?: string
  readonly VITE_EMAILJS_TEMPLATE_ORDER?: string
  readonly VITE_EMAILJS_TEMPLATE_INBOX?: string
  readonly VITE_STORE_EMAIL?: string
}
