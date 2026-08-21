import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions
export async function getNews(options = {}) {
  const {
    limit = 20,
    offset = 0,
    category = null,
    isTrending = null,
    isBreaking = null,
    status = 'approved',
    orderBy = 'published_at',
    orderDirection = 'desc',
  } = options

  let query = supabase
    .from('news')
    .select(`
      *,
      categories(name, slug, icon),
      users!reporter_id(full_name, avatar_url)
    `)
    .eq('status', status)
    .order(orderBy, { ascending: orderDirection === 'asc' })
    .range(offset, offset + limit - 1)

  if (category) {
    query = query.eq('categories.slug', category)
  }
  if (isTrending !== null) {
    query = query.eq('is_trending', isTrending)
  }
  if (isBreaking !== null) {
    query = query.eq('is_breaking', isBreaking)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching news:', error)
    return null
  }

  return data
}

export async function getNewsBySlug(slug) {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      categories(name, slug, icon),
      users!reporter_id(full_name, avatar_url)
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching news by slug:', error)
    return null
  }

  return data
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return null
  }

  return data
}

export async function getLiveUpdates() {
  const { data, error } = await supabase
    .from('news')
    .select('id, headline, slug, published_at, is_breaking')
    .eq('status', 'approved')
    .eq('is_breaking', true)
    .order('published_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching live updates:', error)
    return null
  }

  return data
}