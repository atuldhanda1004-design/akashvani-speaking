'use client';

export default function AdBanner({ ads, position }) {
  const ad = ads?.find((a) => a.position === position && a.is_active);
  if (!ad) {
    // Default placeholder (non-intrusive)
    return (
      <div className={`my-4 ${position === 'sidebar' ? 'h-64' : 'h-24'} bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm border-2 border-dashed`}>
        विज्ञापन स्थान
      </div>
    );
  }

  if (ad.ad_type === 'adsense') {
    return (
      <div className="my-4 min-h-[90px] flex items-center justify-center">
        <div dangerouslySetInnerHTML={{ __html: ad.adsense_code }} />
      </div>
    );
  }

  if (ad.ad_type === 'image') {
    return (
      <a href={ad.link_url} target="_blank" rel="noopener sponsored" className="block my-4">
        <img src={ad.image_url} alt={ad.title} className="w-full rounded-xl" loading="lazy" />
        <p className="text-[10px] text-gray-400 text-right mt-1">विज्ञापन</p>
      </a>
    );
  }

  return null;
}