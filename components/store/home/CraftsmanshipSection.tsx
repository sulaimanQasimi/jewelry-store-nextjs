'use client'

import { motion } from 'framer-motion'

const MACRO_IMAGES = [
  '/images/home/craftsmanship-1.jpg',
  '/images/home/craftsmanship-2.jpg',
  '/images/home/craftsmanship-3.jpg',
]

const PERSIAN_TEXT = [
  'هر قطعه با دست ساخته می‌شود؛ از نخستین طرح تا آخرین صیقل.',
  'ما به سنتِ زرگری و ظرافتِ امروز باور داریم.',
  'جواهری که می‌خرید، برای نسل‌ها می‌ماند.',
]

export default function CraftsmanshipSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#0C0C0C]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{ backgroundImage: "url('/images/home/craftsmanship-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0C]/95 via-[#0C0C0C] to-[#0C0C0C]/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.p
          className="font-[var(--font-playfair)] text-[#D4AF37] tracking-[0.35em] text-xs text-center mb-3 uppercase"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          هنر و اصالت
        </motion.p>
        <motion.h2
          className="font-[var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-light text-white text-center mb-16 max-w-3xl mx-auto leading-snug tracking-tight"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          از دست تا قلب؛ داستان هر قطعه
        </motion.h2>

        {/* Macro imagery strip */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {MACRO_IMAGES.map((src, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-none overflow-hidden bg-[#1a1a1a]"
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url('${src}')` }}
              />
            </div>
          ))}
        </motion.div>

        {/* Poetic Persian lines */}
        <div className="max-w-3xl mx-auto space-y-8">
          {PERSIAN_TEXT.map((line, i) => (
            <motion.p
              key={i}
              className="font-[var(--font-playfair)] text-lg md:text-xl text-white/85 text-center leading-loose"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}
