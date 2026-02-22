'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

const BENTO_ITEMS = [
  {
    title: 'انگشتر',
    href: '/shop?category=rings',
    size: 'large',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  },
  {
    title: 'گردنبند',
    href: '/shop?category=necklaces',
    size: 'tall',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
  },
  {
    title: 'دست‌بند',
    href: '/shop?category=bracelets',
    size: 'wide',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800&q=80',
  },
  {
    title: 'گوشواره',
    href: '/shop?category=earrings',
    size: 'small',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80',
  },
  {
    title: 'ساعت و اکسسوری',
    href: '/shop',
    size: 'small',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  },
]

const sizeClasses: Record<string, string> = {
  large: 'md:col-span-2 md:row-span-2',
  tall: 'md:row-span-2',
  wide: 'md:col-span-2',
  small: '',
}

export default function BentoGrid() {
  return (
    <section className="py-20 md:py-28 px-4 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">
        <motion.p
          className="font-[var(--font-playfair)] text-[#D4AF37] tracking-[0.25em] text-sm text-center mb-2"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          گزیده
        </motion.p>
        <motion.h2
          className="font-[var(--font-playfair)] text-3xl md:text-4xl font-light text-[#2C2C2C] text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          مجموعه‌های برگزیده
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-5 auto-rows-fr">
          {BENTO_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={sizeClasses[item.size]}
            >
              <Link
                href={item.href}
                className="group block h-full min-h-[280px] md:min-h-0 rounded-sm overflow-hidden bg-[#E5E0D9] relative"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/90 via-[#2C2C2C]/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <h3 className="font-[var(--font-playfair)] text-2xl md:text-3xl text-[#FDFBF7] relative z-10 group-hover:text-[#D4AF37] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-2 text-[#FDFBF7]/90 text-sm font-medium group-hover:gap-3 transition-all duration-300">
                    مشاهدهٔ مجموعه
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
