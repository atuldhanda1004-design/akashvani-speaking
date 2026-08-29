import { createClient } from '@supabase/supabase-js'

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseUrl = rawUrl.trim().replace(/\/+$/, '')
const supabaseAnonKey = rawKey.trim()

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

// ===== NEWS =====
export async function getNews(options = {}) {
  if (!supabase) return null
  const {
    limit = 50, offset = 0, categorySlug = null,
    isTrending = null, isBreaking = null, status = 'approved',
    reporterId = null,
  } = options

  try {
    let q = supabase
      .from('news')
      .select('*, categories(id,name,slug,icon), users!reporter_id(id,full_name,role)')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status !== 'all') q = q.eq('status', status)
    if (isTrending !== null) q = q.eq('is_trending', isTrending)
    if (isBreaking !== null) q = q.eq('is_breaking', isBreaking)
    if (reporterId !== null) q = q.eq('reporter_id', reporterId)

    const { data, error } = await q
    if (error) return null
    if (categorySlug && data) return data.filter((n) => n.categories?.slug === categorySlug)
    return data
  } catch { return null }
}

export async function getNewsBySlug(slug) {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*, categories(id,name,slug,icon), users!reporter_id(id,full_name,role)')
      .eq('slug', slug)
      .maybeSingle()
    if (error) return null
    return data
  } catch { return null }
}

export async function getCategories() {
  if (!supabase) return null
  try {
    const { data } = await supabase.from('categories').select('*').order('name')
    return data
  } catch { return null }
}

export async function getLiveUpdates(limit = 10) {
  if (!supabase) return null
  try {
    const { data } = await supabase
      .from('news').select('id,slug,headline,published_at,is_breaking')
      .eq('status', 'approved').eq('is_breaking', true)
      .order('published_at', { ascending: false }).limit(limit)
    return data
  } catch { return null }
}

// ===== AUTH (Demo removed — real only) =====
export async function signIn(email, password) {
  if (!supabase) throw new Error('Database कनेक्ट नहीं है')
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(), password: password.trim(),
  })
  if (error) {
    if (error.message?.includes('Invalid login credentials')) throw new Error('गलत ईमेल या पासवर्ड')
    throw error
  }
  return data
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut()
}

export async function getCurrentUser() {
  if (!supabase) return null
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle()
    return {
      ...user,
      full_name: userData?.full_name || user.email?.split('@')[0] || 'User',
      role: userData?.role || 'admin',
      payout_balance: userData?.payout_balance || 0,
      is_active: userData?.is_active !== false,
    }
  } catch { return null }
}

export async function resetPasswordEmail(email) {
  if (!supabase) throw new Error('DB not connected')
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/admin/login`,
  })
  if (error) throw error
  return true
}

// ===== UPLOAD =====
export async function uploadImage(file, folder = 'news') {
  if (!supabase) throw new Error('DB not connected')
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { data, error } = await supabase.storage.from('images').upload(fileName, file, { upsert: false })
  if (error) throw error
  const { data: urlData } = supabase.storage.from('images').getPublicUrl(data.path)
  return urlData.publicUrl
}

export async function createNews(payload) {
  if (!supabase) throw new Error('DB not connected')
  const { data, error } = await supabase.from('news').insert([payload]).select().single()
  if (error) throw error
  return data
}

// ===== REPORTERS =====
export async function getReporters() {
  if (!supabase) return []
  const { data } = await supabase.from('users').select('*').eq('role', 'reporter')
  return data || []
}

export async function updatePayout(reporterId, amount) {
  if (!supabase) return false
  const { error } = await supabase.from('users').update({ payout_balance: amount }).eq('id', reporterId)
  return !error
}

export async function createReporterByAdmin(email, password, fullName) {
  if (!supabase) throw new Error('DB not connected')
  const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: password.trim() })
  if (error) throw error
  if (data?.user) {
    await supabase.from('users').upsert({
      id: data.user.id,
      full_name: fullName.trim(),
      role: 'reporter',
      payout_balance: 0,
      is_active: true,
    })
  }
  return true
}

export async function toggleReporterActive(reporterId, active) {
  if (!supabase) return false
  const { error } = await supabase.from('users').update({ is_active: active }).eq('id', reporterId)
  return !error
}