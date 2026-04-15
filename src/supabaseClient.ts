import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error('Missing or invalid VITE_SUPABASE_URL in environment. Set VITE_SUPABASE_URL to your Supabase URL.');
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase public/anon key in environment. Set VITE_SUPABASE_ANON_KEY or VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 