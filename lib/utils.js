import { formatDistanceToNow, format } from 'date-fns';
import { hi } from 'date-fns/locale';

// Hindi me time dikhane ke liye
export function getTimeAgo(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'अभी-अभी';
    if (diffMins < 60) return `${diffMins} मिनट पहले`;
    if (diffHours < 24) return `${diffHours} घंटे पहले`;
    if (diffDays < 7) return `${diffDays} दिन पहले`;
    return format(date, 'dd MMM yyyy', { locale: hi });
  } catch {
    return '';
  }
}

export function formatDate(dateString) {
  return format(new Date(dateString), 'dd MMMM yyyy, hh:mm a', { locale: hi });
}

// Slug generate karna
export function generateSlug(headline) {
  return headline
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 80) + '-' + Date.now().toString(36);
}

// YouTube URL se embed URL banana
export function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

// Instagram embed
export function getInstagramEmbedUrl(url) {
  if (!url) return null;
  return url.replace(/\/$/, '') + '/embed';
}