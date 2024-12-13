import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qothiaalyhdfuesmvcvu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvdGhpYWFseWhkZnVlc212Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MTAwOTAsImV4cCI6MjA0OTQ4NjA5MH0.4eKrXkqGeFRZeZsgzo0tR0G9ULR9EC3F9Z5HKnet7Ng';

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