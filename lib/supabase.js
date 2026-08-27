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
    !supabaseUrl.includes('placeholder') &&
    supabaseUrl.startsWith('https://')
  )
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

// ========== FETCH HELPERS ==========

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

// ========== AUTH & SESSION (Fixed redirect loop) ==========

export async function signIn(email, password) {
  const cleanEmail = email.trim()
  const cleanPassword = password.trim()

  // Demo Admin Login Handler
  if (cleanEmail === 'admin@akashvanispeaking.news' && cleanPassword === 'admin123') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_admin_session', 'true')
    }
    return { user: { email: cleanEmail, role: 'admin' } }
  }

  // Clear demo session if attempting real login
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo_admin_session')
  }

  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase कनेक्ट नहीं है। Demo ID: admin@akashvanispeaking.news / admin123 का प्रयोग करें।')
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword })
  if (error) throw error
  return data
}

export async function signOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo_admin_session')
  }
  if (supabase) {
    await supabase.auth.signOut()
  }
}

export async function getCurrentUser() {
  // Check Demo Local Session first
  if (typeof window !== 'undefined' && localStorage.getItem('demo_admin_session') === 'true') {
    return {
      id: 'demo-admin-id',
      email: 'admin@akashvanispeaking.news',
      full_name: 'Main Admin (Demo)',
      role: 'admin',
      payout_balance: 0
    }
  }

  if (!isSupabaseConfigured() || !supabase) return null

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    
    // Try fetching profile from 'users' table safely
    try {
      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle()
      return {
        ...user,
        full_name: userData?.full_name || user.email?.split('@')[0] || 'Admin User',
        role: userData?.role || 'admin',
        payout_balance: userData?.payout_balance || 0
      }
    } catch {
      return {
        ...user,
        full_name: user.email?.split('@')[0] || 'Admin User',
        role: 'admin',
        payout_balance: 0
      }
    }
  } catch { return null }
}

// ========== PASSWORD RESET ==========

export async function resetPasswordEmail(email) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase कनेक्ट नहीं है। Demo लॉगिन के लिए पासवर्ड admin123 ही रहेगा।')
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/admin/login`,
  })
  if (error) throw error
  return true
}

// ========== UPLOAD & NEWS ==========

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

export async function getReporters() {
  if (!supabase) return []
  const { data, error } = await supabase.from('users').select('*').eq('role', 'reporter')
  if (error) return []
  return data
}

export async function updatePayout(reporterId, amount) {
  if (!supabase) return false
  const { error } = await supabase.from('users').update({ payout_balance: amount }).eq('id', reporterId)
  return !error
}