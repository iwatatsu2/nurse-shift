import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Device ID for anonymous identification
export function getDeviceId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('nurse-device-id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('nurse-device-id', id)
  }
  return id
}
