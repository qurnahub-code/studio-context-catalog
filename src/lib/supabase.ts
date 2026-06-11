import { createClient } from '@supabase/supabase-js';

// We provide dummy placeholders so that the Next.js static build process 
// doesn't crash if the environment variables are temporarily missing.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
