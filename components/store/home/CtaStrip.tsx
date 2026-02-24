'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CtaStrip() {
  return (
    <section className="py-20 md:py-28 px-4 bg-[#0C0C0C] text-white text-center">
      <motion.p
        className="font-[var(--font-playfair)] text-xl md:text-2xl mb-8 text-white/90"
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
          className="inline-flex items-center justify-center min-w-[200px] px-8 py-4 text-sm font-semibold tracking-widest uppercase border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#0C0C0C] transition-all duration-300"
        >
          تماس با ما
        </Link>
      </motion.div>
    </section>
  )
}
