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
  const {
    limit = 20,
    offset = 0,
    categorySlug = null,
    isTrending = null,
    isBreaking = null,
    status = 'approved',
    reporterId = null,
  } = options

  try {
    let query = supabase
      .from('news')
      .select(
        '*, categories(id, name, slug, icon), users!reporter_id(id, full_name, avatar_url, role)'
      )
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
  } catch {
    return null
  }
}

export async function getNewsBySlug(slug) {
  if (!isSupabaseConfigured() || !supabase) return null
  try {
    const { data, error } = await supabase
      .from('news')
      .select(
        '*, categories(id, name, slug, icon), users!reporter_id(id, full_name, avatar_url)'
      )
      .eq('slug', slug)
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

// ========== AUTH & SESSION (Demo Account Always Supported) ==========

export async function signIn(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase()
  const cleanPassword = (password || '').trim()

  // 1. DEMO LOGIN CHECK (Always Works)
  if (cleanEmail === 'admin@akashvanispeaking.news' && cleanPassword === 'admin123') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_admin_session', 'true')
    }
    return { user: { email: cleanEmail, role: 'admin' } }
  }

  // Remove demo session if trying a different login
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo_admin_session')
  }

  // 2. IF NOT DEMO, CHECK SUPABASE CONNECTION
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error(
      'Supabase डेटाबेस कनेक्ट नहीं है। कृपया टेस्ट करने के लिए ईमेल "admin@akashvanispeaking.news" और पासवर्ड "admin123" का प्रयोग करें।'
    )
  }

  // 3. REAL SUPABASE AUTH
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: cleanPassword,
  })

  if (error) {
    if (error.message?.includes('Invalid login credentials')) {
      throw new Error('गलत पासवर्ड या ईमेल दर्ज किया है!')
    }
    throw error
  }

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
  // Check Demo Session First
  if (
    typeof window !== 'undefined' &&
    localStorage.getItem('demo_admin_session') === 'true'
  ) {
    return {
      id: 'demo-admin-id',
      email: 'admin@akashvanispeaking.news',
      full_name: 'Main Admin (Demo)',
      role: 'admin',
      payout_balance: 0,
    }
  }

  if (!isSupabaseConfigured() || !supabase) return null

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user) return null

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      return {
        ...user,
        full_name: userData?.full_name || user.email?.split('@')[0] || 'Admin User',
        role: userData?.role || 'admin',
        payout_balance: userData?.payout_balance || 0,
      }
    } catch {
      return {
        ...user,
        full_name: user.email?.split('@')[0] || 'Admin User',
        role: 'admin',
        payout_balance: 0,
      }
    }
  } catch {
    return null
  }
}

// ========== PASSWORD RESET ==========

export async function resetPasswordEmail(email) {
  const cleanEmail = (email || '').trim().toLowerCase()
  if (cleanEmail === 'admin@akashvanispeaking.news') {
    throw new Error('डेमो टेस्ट अकाउंट का पासवर्ड "admin123" ही रहेगा। असली अकाउंट का ईमेल दर्ज करें।')
  }
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase कनेक्ट नहीं है।')
  }
  const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
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
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(data.path)
  return urlData.publicUrl
}

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

export async function getReporters() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'reporter')
  if (error) return []
  return data
}

export async function updatePayout(reporterId, amount) {
  if (!supabase) return false
  const { error } = await supabase
    .from('users')
    .update({ payout_balance: amount })
    .eq('id', reporterId)
  return !error
}

// ========== ADMIN CREATE REPORTER ==========

export async function createReporterByAdmin(email, password, fullName) {
  if (!supabase) throw new Error('Supabase not configured')

  // 1. Create Auth User
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: password.trim(),
  })

  if (error) throw error

  // 2. Insert into users table as reporter
  if (data?.user) {
    const { error: dbError } = await supabase.from('users').insert([{
      id: data.user.id,
      full_name: fullName.trim(),
      display_name: fullName.trim(),
      role: 'reporter',
      payout_balance: 0
    }])
    if (dbError) throw dbError
  }

  return true
}