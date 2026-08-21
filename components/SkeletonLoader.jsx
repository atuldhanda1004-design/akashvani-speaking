export function TrendingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-[45%] h-64 md:h-80 bg-gray-200" />
        <div className="md:w-[55%] p-6 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-1 bg-gray-100 rounded w-20" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${100 - i * 10}%` }} />
            ))}
          </div>
          <div className="flex items-center justify-between pt-4">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-10 bg-gray-200 rounded-lg w-28" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-full" />
        <div className="h-5 bg-gray-200 rounded w-4/5" />
        <div className="h-1 bg-gray-100 rounded w-16" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded-lg w-24" />
        </div>
      </div>
    </div>
  )
}

export function LiveUpdateSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl">
          <div className="w-20 h-10 bg-gray-200 rounded-lg flex-shrink-0" />
          <div className="flex-1 h-4 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  )
}