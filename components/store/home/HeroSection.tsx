'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HeroSection() {
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 700], [0, 100])

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-[#1a1a1a]">
      {/* Background with parallax */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80')`,
            y: backgroundY,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/70 via-[#1a1a1a]/50 to-[#1a1a1a]/90" />
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-[var(--font-playfair)] text-[#D4AF37] tracking-[0.35em] text-xs md:text-sm mb-6 uppercase">
          مجموعهٔ جدید
        </p>
        <h1 className="font-[var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#FDFBF7] tracking-tight mb-6 leading-[1.15]">
          ظرافت جاودان
          <br />
          <span className="text-[#D4AF37]">ساخته‌شده برای همیشه</span>
        </h1>
        <p className="text-[#FDFBF7]/85 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
          قطعات تازهٔ ما را کشف کنید؛ جایی که اصالت با طراحی امروزی درمی‌آمیزد.
        </p>
        <Link
          href="/shop"
          className="
            inline-flex items-center justify-center px-10 py-4 text-sm font-medium tracking-wide
            border border-[#D4AF37] text-[#D4AF37] bg-transparent
            transition-all duration-500 ease-out
            hover:bg-[#D4AF37] hover:text-[#1a1a1a]
          "
        >
          دیدن مجموعه
        </Link>
      </motion.div>

      {/* Subtle parallax hint: decorative line */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        aria-hidden
      />
    </section>
  )
}
