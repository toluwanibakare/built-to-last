import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://upknjyvfnxjmbnlobldt.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwa25qeXZmbnhqbWJubG9ibGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwODQ1NDAsImV4cCI6MjEwMjY2MDU0MH0.H97Uxrn6ODRSpKj14w81k0UTcu7Q88y7zIqVzdGh34I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
