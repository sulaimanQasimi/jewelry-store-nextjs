'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HeroSection() {
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 700], [0, 100])

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-[#0C0C0C]">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/images/home/hero.jpg')", y: backgroundY }}
        />
        <div className="absolute inset-0 bg-[#0C0C0C]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-[#0C0C0C]/40" />
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 pt-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <p className="font-[var(--font-playfair)] text-[#D4AF37] tracking-[0.4em] text-xs md:text-sm mb-6 uppercase">
          مجموعهٔ جدید
        </p>
        <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-light text-white tracking-tight mb-6 leading-[1.05]">
          ظرافت
          <br />
          <span className="text-[#D4AF37]">جاودان</span>
        </h1>
        <p className="text-white/80 text-base md:text-lg max-w-md mx-auto mb-12 tracking-wide">
          قطعاتی که برای همیشه می‌مانند.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center min-w-[200px] px-8 py-4 text-sm font-semibold tracking-widest uppercase bg-white text-[#0C0C0C] hover:bg-[#D4AF37] hover:text-[#0C0C0C] transition-all duration-300"
          >
            مشاهده مجموعه
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center min-w-[200px] px-8 py-4 text-sm font-semibold tracking-widest uppercase border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#0C0C0C] transition-all duration-300"
          >
            درباره ما
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        aria-hidden
      >
        <span className="text-[10px] tracking-[0.3em] text-white/50 uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  )
}
