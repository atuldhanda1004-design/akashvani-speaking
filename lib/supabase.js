import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if valid URL and not dummy/placeholder
export const isSupabaseConfigured = () => {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseUrl.includes('placeholder') &&
    supabaseUrl.startsWith('https://')
  )
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

// ========== FETCH HELPERS (Silently falls back to dummy data) ==========

export async function getNews(options = {}) {
  if (!isSupabaseConfigured() || !supabase) return null
  const {
    limit = 20,
    offset = 0,
    categorySlug = null,
    isTrending = null,
    isBreaking = null,
    status = 'approved',
  } = options

  try {
    let query = supabase
      .from('news')
      .select(`
        *,
        categories(id, name, slug, icon),
        users!reporter_id(id, full_name, avatar_url)
      `)
      .eq('status', status)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (isTrending !== null) query = query.eq('is_trending', isTrending)
    if (isBreaking !== null) query = query.eq('is_breaking', isBreaking)

    const { data, error } = await query
    if (error) return null

    if (categorySlug && data) {
      return data.filter((n) => n.categories?.slug === categorySlug)
    }
    return data
  } catch {
    return null
  }
}

export async function getNewsBySlug(slug) {
  if (!isSupabaseConfigured() || !supabase) return null
  try {
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        categories(id, name, slug, icon),
        users!reporter_id(id, full_name, avatar_url)
      `)
      .eq('slug', slug)
      .eq('status', 'approved')
      .maybeSingle()

    if (error) return null
    return data
  } catch {
    return null
  }
}

export async function getCategories() {
  if (!isSupabaseConfigured() || !supabase) return null
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) return null
    return data
  } catch {
    return null
  }
}

export async function getLiveUpdates(limit = 10) {
  if (!isSupabaseConfigured() || !supabase) return null
  try {
    const { data, error } = await supabase
      .from('news')
      .select('id, slug, headline, published_at, is_breaking')
      .eq('status', 'approved')
      .eq('is_breaking', true)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) return null
    return data
  } catch {
    return null
  }
}

// ========== AUTH ==========

export async function signIn(email, password) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function getCurrentUser() {
  if (!supabase) return null
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

// ========== UPLOAD ==========

export async function uploadImage(file, folder = 'news') {
  if (!supabase) throw new Error('Supabase not configured')
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data: urlData } = supabase.storage.from('images').getPublicUrl(data.path)
  return urlData.publicUrl
}

// ========== INSERT NEWS ==========

export async function createNews(payload) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('news')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return data
}