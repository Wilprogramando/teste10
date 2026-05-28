import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const FALLBACK_SUPABASE_URL = 'https://cbwxgsfxkjgeuklnokzv.supabase.co';

const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNid3hnc2Z4a2pnZXVrbG5va3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NTA0NzIsImV4cCI6MjA5NTQyNjQ3Mn0.vNrVdTrhkRYkkn4tx83bu_tGvhnOaQ7dzE4fDO1JIWo';

export function createServerSupabase() {
  const cookieStore = cookies();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {},
      remove() {},
    },
  });
}
