'use client';
import { getYouTubeEmbedUrl } from '@/lib/utils';
import { Video } from 'lucide-react';

export default function VideoSection({ videos }) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="mt-12 bg-gray-900 text-white rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Video className="text-red-500" size={24} />
        <h2 className="text-2xl font-black">वीडियो खबरें</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <div key={vid.id} className="bg-gray-800 rounded-xl overflow-hidden shadow">
            {vid.video_type === 'youtube' && vid.video_url ? (
              <div className="aspect-video w-full">
                <iframe
                  src={getYouTubeEmbedUrl(vid.video_url)}
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : vid.uploaded_video_url ? (
              <video src={vid.uploaded_video_url} controls className="aspect-video w-full object-cover" />
            ) : null}
            <div className="p-4">
              <h3 className="font-bold text-sm text-gray-100 line-clamp-2">{vid.headline}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}