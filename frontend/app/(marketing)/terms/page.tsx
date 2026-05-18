import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 py-24">
        <Link href="/" className="text-orange-400 text-sm hover:underline mb-8 block">
          ← Wapas Homepage
        </Link>
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: May 2026</p>

        <div className="space-y-6 text-gray-400 leading-relaxed">
          {[
            {
              title: 'Service Usage',
              content: 'AutoFlow ka use karke aap agree karte hain ki aap Instagram ke Terms of Service follow karenge aur koi spam nahi karenge.',
            },
            {
              title: 'Account Responsibility',
              content: 'Aapke account ki security aapki zimmedari hai. Apna password kisi ke saath share mat karo.',
            },
            {
              title: 'Service Availability',
              content: 'Hum best-effort uptime provide karte hain lekin 100% uptime guarantee nahi karte.',
            },
            {
              title: 'Cancellation',
              content: 'Aap kabhi bhi cancel kar sakte hain. Cancellation ke baad billing band ho jaayegi.',
            },
            {
              title: 'Contact',
              content: 'Terms ke baare mein sawaal: legal@autoflow.in',
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
