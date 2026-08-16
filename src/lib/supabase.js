import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gcefvwdmeqhihvyrugqe.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZWZ2d2RtZXFoaWh2eXJ1Z3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4NDIyMDAsImV4cCI6MjEwMjQxODIwMH0.F3flUT6Tzd15yG5z6BJNEW-PLl621ZvUEn-G-SGfv98'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})
