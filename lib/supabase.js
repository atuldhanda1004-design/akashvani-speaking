import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = () => {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    supabaseUrl.startsWith('https://')
  )
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

export async function getNews(options = {}) {
  if (!isSupabaseConfigured() || !supabase) return null
  const { limit = 20, offset = 0, categorySlug = null, isTrending = null, isBreaking = null, status = 'approved', reporterId = null } = options

  try {
    let query = supabase
      .from('news')
      .select('*, categories(id, name, slug, icon), users!reporter_id(id, full_name, avatar_url, role)')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status !== 'all') query = query.eq('status', status)
    if (isTrending !== null) query = query.eq('is_trending', isTrending)
    if (isBreaking !== null) query = query.eq('is_breaking', isBreaking)
    if (reporterId !== null) query = query.eq('reporter_id', reporterId)

    const { data, error } = await query
    if (error) return null

    if (categorySlug && data) {
      return data.filter((n) => n.categories?.slug === categorySlug)
    }
    return data
  } catch { return null }
}

export async function getNewsBySlug(slug) {
  if (!isSupabaseConfigured() || !supabase) return null
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*, categories(id, name, slug, icon), users!reporter_id(id, full_name, avatar_url)')
      .eq('slug', slug)
      .maybeSingle()
    if (error) return null
    return data
  } catch { return null }
}

export async function getCategories() {
  if (!isSupabaseConfigured() || !supabase) return null
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (error) return null
    return data
  } catch { return null }
}

export async function getLiveUpdates(limit = 10) {
  if (!isSupabaseConfigured() || !supabase) return null
  try {
    const { data, error } = await supabase.from('news').select('id, slug, headline, published_at, is_breaking').eq('status', 'approved').eq('is_breaking', true).order('published_at', { ascending: false }).limit(limit)
    if (error) return null
    return data
  } catch { return null }
}

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
    if (!user) return null
    
    // Fetch full user details including role and payout
    const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single()
    return { ...user, ...userData }
  } catch { return null }
}

export async function uploadImage(file, folder = 'news') {
  if (!supabase) throw new Error('Supabase not configured')
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { data, error } = await supabase.storage.from('images').upload(fileName, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data: urlData } = supabase.storage.from('images').getPublicUrl(data.path)
  return urlData.publicUrl
}

export async function createNews(payload) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('news').insert([payload]).select().single()
  if (error) throw error
  return data
}

// Admin: Get all reporters
export async function getReporters() {
  if (!supabase) return []
  const { data, error } = await supabase.from('users').select('*').eq('role', 'reporter')
  if (error) return []
  return data
}

// Admin: Update Payout
export async function updatePayout(reporterId, amount) {
  if (!supabase) return false
  const { error } = await supabase.from('users').update({ payout_balance: amount }).eq('id', reporterId)
  return !error
}