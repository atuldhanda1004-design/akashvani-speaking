import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-20 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h1 className="text-8xl font-bold font-poppins text-brand-navy mb-4">404</h1>
        <h2 className="text-2xl font-bold font-yantramanav text-gray-900 mb-3">पेज नहीं मिला</h2>
        <p className="text-gray-500 font-yantramanav mb-8">
          जो पेज आप ढूंढ रहे हैं वो उपलब्ध नहीं है।
        </p>
        <Link href="/" className="btn-navy">होम पेज पर जाएं</Link>
      </main>
      <Footer />
    </>
  )
}