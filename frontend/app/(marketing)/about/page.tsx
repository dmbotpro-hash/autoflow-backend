import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 py-24">
        <Link href="/" className="text-orange-400 text-sm hover:underline mb-8 block">
          ← Wapas Homepage
        </Link>
        <h1 className="text-4xl font-bold mb-6">AutoFlow ke Baare Mein</h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-4">
          AutoFlow ek Indian Instagram automation platform hai jo small businesses
          aur creators ke liye banaya gaya hai.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Humara mission hai ki har Indian creator aur business apni Instagram
          presence ko automate kar sake — bina technical knowledge ke, bina
          mehenga subscription ke.
        </p>
        <p className="text-gray-400 leading-relaxed">
          ManyChat se 60% sasta, Hindi support ke saath, Indian payment methods
          ke saath. Ye hai AutoFlow.
        </p>
      </div>
    </div>
  );
}
