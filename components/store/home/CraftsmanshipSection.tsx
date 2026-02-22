'use client'

import { motion } from 'framer-motion'

const MACRO_IMAGES = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80',
  'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&q=80',
]

const PERSIAN_TEXT = [
  'هر قطعه با دست ساخته می‌شود؛ از نخستین طرح تا آخرین صیقل.',
  'ما به سنتِ زرگری و ظرافتِ امروز باور داریم.',
  'جواهری که می‌خرید، برای نسل‌ها می‌ماند.',
]

export default function CraftsmanshipSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#2C2C2C]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=60')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C2C2C]/95 via-[#2C2C2C] to-[#2C2C2C]/95" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.p
          className="font-[var(--font-playfair)] text-[#D4AF37] tracking-[0.3em] text-sm text-center mb-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          هنر و اصالت
        </motion.p>
        <motion.h2
          className="font-[var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-light text-[#FDFBF7] text-center mb-16 max-w-3xl mx-auto leading-snug"
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
              className="aspect-[4/3] rounded-sm overflow-hidden bg-[#1a1a1a]"
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
              className="font-[var(--font-playfair)] text-lg md:text-xl text-[#FDFBF7]/90 text-center leading-loose"
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
