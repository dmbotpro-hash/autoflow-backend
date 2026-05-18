'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Priya Sharma',
    handle: '@priyafashion',
    avatar: 'P',
    text: 'Pehle manually har comment ka reply karna padta tha. Ab AutoFlow sab handle karta hai. Mere DMs 10x badh gaye hain!',
    role: 'Fashion Creator, Mumbai',
    avatarBg: 'bg-gradient-to-tr from-pink-500 to-rose-500',
  },
  {
    name: 'Rahul Gupta',
    handle: '@rahulcooks',
    avatar: 'R',
    text: 'Setup mein sirf 5 minute lage. Ab jab bhi koi "RECIPE" comment karta hai, usse turant link mil jaata hai. Bahut kamaal!',
    role: 'Food Blogger, Delhi',
    avatarBg: 'bg-gradient-to-tr from-purple-500 to-indigo-500',
  },
  {
    name: 'Sneha Patel',
    handle: '@sneha.boutique',
    avatar: 'S',
    text: 'ManyChat bahut mehenga tha. AutoFlow same features deta hai ₹999 mein. Indian business ke liye perfect solution.',
    role: 'Boutique Owner, Ahmedabad',
    avatarBg: 'bg-gradient-to-tr from-orange-500 to-amber-500',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-black py-24 px-6">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 select-none">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.5, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="section-label"
          >
            Reviews
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-white text-3xl sm:text-[32px] font-semibold leading-[1.25] tracking-tight mt-3 mb-4 font-sans"
          >
            Creators Kya Kehte Hain
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-1.5 text-xs text-[#A0A0A0] font-medium tracking-wide"
          >
            <span className="text-white">★★★★★</span> Rated 4.1/5 on Trustpilot
          </motion.div>
        </div>

        {/* Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            }
          }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-7 hover:border-[rgba(255,255,255,0.15)] transition-all duration-200"
            >
              {/* Review Text */}
              <p className="text-[#D0D0D0] text-[15px] leading-relaxed mb-6 font-normal">
                "{t.text}"
              </p>
              
              {/* Reviewer Details */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${t.avatarBg} flex items-center justify-center text-white text-xs font-bold shadow-inner uppercase`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-[14px] font-semibold leading-none mb-1">
                    {t.name}
                  </div>
                  <div className="text-[#A0A0A0] text-xs font-medium leading-none">
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
