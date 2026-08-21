import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-8xl font-black text-red-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">पेज नहीं मिला</h2>
        <p className="text-gray-500 mt-2">यह पेज मौजूद नहीं है या हटा दिया गया है।</p>
        <Link href="/" className="inline-block mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition">
          ← होम पेज पर जाएं
        </Link>
      </div>
    </div>
  );
}