import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-center px-4">
      <div>
        <div className="text-6xl font-bold text-orange-500 mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Page nahi mili
        </h1>
        <p className="text-gray-400 mb-6">
          Ye page exist nahi karta ya move ho gayi hai.
        </p>
        <Link
          href="/"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Homepage Pe Jao
        </Link>
      </div>
    </div>
  );
}
