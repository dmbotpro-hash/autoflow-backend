import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-5 py-24">
        <Link href="/" className="text-orange-400 text-sm hover:underline mb-8 block">
          ← Wapas Homepage
        </Link>
        <h1 className="text-4xl font-bold mb-6">Contact Karo</h1>
        <p className="text-gray-400 mb-8">
          Koi sawaal hai? Hum yahan hain!
        </p>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          {[
            { label: 'Email', value: 'hello@autoflow.in', icon: '📧' },
            { label: 'WhatsApp', value: '+91 98765 43210', icon: '💬' },
            { label: 'Instagram', value: '@autoflow.in', icon: '📸' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="text-gray-400 text-xs">{item.label}</div>
                <div className="text-white font-medium">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
