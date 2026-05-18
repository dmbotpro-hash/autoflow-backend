import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 py-24">
        <Link href="/" className="text-orange-400 text-sm hover:underline mb-8 block">
          ← Wapas Homepage
        </Link>
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: May 2026</p>

        <div className="space-y-6 text-gray-400 leading-relaxed">
          {[
            {
              title: 'Data Collection',
              content: 'Hum sirf wo data collect karte hain jo aapki service ke liye zaruri hai — email, naam, aur Instagram account details.',
            },
            {
              title: 'Data Usage',
              content: 'Aapka data sirf AutoFlow service provide karne ke liye use hota hai. Hum kabhi aapka data third parties ko nahi bechte.',
            },
            {
              title: 'Instagram Data',
              content: 'Hum Meta ke official API use karte hain. Aapka Instagram password kabhi store nahi hota.',
            },
            {
              title: 'Data Security',
              content: 'Saara data encrypted hai. Hum industry-standard security practices follow karte hain.',
            },
            {
              title: 'Contact',
              content: 'Privacy ke baare mein sawaal ke liye: privacy@autoflow.in',
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-white font-semibold text-lg mb-2">
                {section.title}
              </h2>
              <p>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
