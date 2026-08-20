import Link from 'next/link';

const categories = [
  { name: 'हरियाणा', slug: 'haryana', icon: '📍' },
  { name: 'राजनीति', slug: 'politics', icon: '🏛️' },
  { name: 'देश', slug: 'india', icon: '🇮🇳' },
  { name: 'खेल', slug: 'sports', icon: '🏏' },
  { name: 'व्यापार', slug: 'business', icon: '💰' },
  { name: 'मनोरंजन', slug: 'entertainment', icon: '🎬' },
  { name: 'अपराध', slug: 'crime', icon: '🚔' },
  { name: 'मौसम', slug: 'weather', icon: '🌦️' },
];

export default function CategoryGrid() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border">
      <h3 className="font-bold text-base text-gray-900 border-l-4 border-red-600 pl-2 mb-4">
        श्रेणियां (Categories)
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-red-50 hover:text-red-600 text-sm font-medium transition"
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}