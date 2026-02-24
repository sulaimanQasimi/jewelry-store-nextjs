'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const BENTO_ITEMS = [
  { title: 'انگشتر', href: '/shop?category=rings', size: 'large', image: '/images/home/bento-rings.jpg' },
  { title: 'گردنبند', href: '/shop?category=necklaces', size: 'tall', image: '/images/home/bento-necklace.jpg' },
  { title: 'دست‌بند', href: '/shop?category=bracelets', size: 'small', image: '/images/home/bento-bracelet.jpg' },
  { title: 'گوشواره', href: '/shop?category=earrings', size: 'small', image: '/images/home/bento-earrings.jpg' },
]

const sizeClasses: Record<string, string> = {
  large: 'md:col-span-2 md:row-span-2',
  tall: 'md:row-span-2',
  small: '',
}

export default function BentoGrid() {
  return (
    <section className="py-24 md:py-32 px-4 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto">
        <motion.p
          className="font-[var(--font-playfair)] text-[#D4AF37] tracking-[0.35em] text-xs text-center mb-3 uppercase"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          دسته‌بندی‌ها
        </motion.p>
        <motion.h2
          className="font-[var(--font-playfair)] text-3xl md:text-5xl font-light text-[#0C0C0C] text-center mb-20 tracking-tight"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          گزیده مجموعه
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 auto-rows-fr">
          {BENTO_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={sizeClasses[item.size]}
            >
              <Link
                href={item.href}
                className="group block h-full min-h-[260px] md:min-h-0 rounded-none overflow-hidden bg-[#0C0C0C] relative"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <h3 className="font-[var(--font-playfair)] text-2xl md:text-3xl text-white font-medium tracking-tight group-hover:text-[#D4AF37] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-white/80 text-xs font-semibold tracking-widest uppercase group-hover:gap-4 transition-all duration-300">
                    مشاهده
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
