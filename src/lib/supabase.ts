import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback to a valid format URL during build time if environment variables are not injected yet
const supabaseUrl = rawUrl.startsWith('http') 
  ? rawUrl.trim().replace(/\/$/, '') 
  : 'https://dqonycetypwjlgcrwczq.supabase.co';

const supabaseAnonKey = rawKey.trim() || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);