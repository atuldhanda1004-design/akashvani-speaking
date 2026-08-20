'use client';
import { getTimeAgo } from '@/lib/utils';
import { Radio, Clock } from 'lucide-react';

export default function LiveUpdates({ updates }) {
  if (!updates?.length) return null;

  // Sort by latest first
  const sorted = [...updates].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
      <h3 className="flex items-center gap-2 text-lg font-bold text-red-700 mb-4">
        <Radio className="animate-pulse" size={20} />
        लाइव अपडेट्स
        <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
          LIVE
        </span>
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-red-200"></div>

        <div className="space-y-4">
          {sorted.map((update, i) => (
            <div key={update.id} className="relative pl-10">
              {/* Timeline dot */}
              <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full ${i === 0 ? 'bg-red-600 animate-pulse' : 'bg-red-300'}`}></div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
                <p className="text-gray-800 text-sm">{update.update_text}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Clock size={10} />
                  <span className="font-medium text-red-500">{getTimeAgo(update.created_at)}</span>
                  <span>({new Date(update.created_at).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}