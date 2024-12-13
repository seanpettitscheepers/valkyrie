import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qothiaalyhdfuesmvcvu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvdGhpYWFseWhkZnVlc212Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg2MjQxNDAsImV4cCI6MjAyNDIwMDE0MH0.qDlvk_z2DhGX0Nc_z6AIIj7ZRGh_jOKVbUoXF9VzFYA';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'valkyrie_auth_token',
      storage: window.localStorage,
      detectSessionInUrl: true,
    },
  }
);