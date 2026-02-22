'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CtaStrip() {
  return (
    <section className="py-16 md:py-20 px-4 bg-[#2C2C2C] text-[#FDFBF7] text-center">
      <motion.p
        className="font-[var(--font-playfair)] text-lg md:text-xl mb-6"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        آمادهٔ یافتن قطعهٔ خود هستید؟
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-10 py-4 text-sm font-medium border border-[#D4AF37] text-[#D4AF37] bg-transparent hover:bg-[#D4AF37] hover:text-[#2C2C2C] transition-all duration-300"
        >
          تماس با ما
        </Link>
      </motion.div>
    </section>
  )
}
