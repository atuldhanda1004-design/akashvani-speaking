import { createClient } from '@supabase/supabase-js';

// Safe URL Formatter (Bina https ya galat URL hone par bhi build fail nahi hone dega)
function getValidUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return 'https://placeholder-project.supabase.co';
  }
  let cleaned = url.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }
  try {
    new URL(cleaned);
    return cleaned;
  } catch {
    return 'https://placeholder-project.supabase.co';
  }
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseUrl = getValidUrl(rawUrl);
const supabaseAnonKey = (rawAnonKey && rawAnonKey.trim()) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyKeyForBuild';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
  },
});

export const createServerClient = () => {
  const serviceKey = (rawServiceKey && rawServiceKey.trim()) || supabaseAnonKey;
  return createClient(supabaseUrl, serviceKey);
};