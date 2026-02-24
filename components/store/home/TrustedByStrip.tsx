'use client'

import { motion } from 'framer-motion'

const LOGOS = [
  { name: 'Luxury Partner 1', label: 'همکار یک' },
  { name: 'Luxury Partner 2', label: 'همکار دو' },
  { name: 'Luxury Partner 3', label: 'همکار سه' },
  { name: 'Luxury Partner 4', label: 'همکار چهار' },
  { name: 'Luxury Partner 5', label: 'همکار پنج' },
]

export default function TrustedByStrip() {
  return (
    <section className="py-12 md:py-16 px-4 border-t border-b border-[#E5E0D9]/60 bg-[#FAFAFA]">
      <motion.p
        className="text-center text-[#0C0C0C]/50 text-xs tracking-[0.3em] uppercase mb-8 font-semibold"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        مورد اعتماد
      </motion.p>
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-10 md:gap-16">
        {LOGOS.map((logo, i) => (
          <motion.div
            key={logo.name}
            className="text-[#0C0C0C]/40 font-[var(--font-playfair)] text-lg md:text-xl font-light tracking-wide hover:text-[#D4AF37] transition-colors duration-300"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            {logo.label}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
