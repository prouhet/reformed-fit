import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging
console.log('=== SUPABASE CLIENT DEBUG ===')
console.log('URL:', supabaseUrl)
console.log('Key exists:', !!supabaseAnonKey)
console.log('Key length:', supabaseAnonKey?.length)
console.log('============================')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ MISSING ENVIRONMENT VARIABLES!')
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Cloudflare')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
