import { createClient } from '@supabase/supabase-js';

// These come from your .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

// This client is what we use everywhere to talk to Supabase
// (uploading images, saving share links, fetching them back)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);