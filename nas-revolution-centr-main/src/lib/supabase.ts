import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://uxwnalprswtyngxpsbez.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_Ut6cQr-rObg_1ZcPCVbErA_erTH8VoQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
