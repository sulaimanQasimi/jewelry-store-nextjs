'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    text: 'صنعت و طراحی بی‌زمان. هر قطعه داستانی دارد.',
    author: 'مشتریان ما',
  },
  {
    text: 'کیفیت و ظرافت در هر جزئیات حس می‌شود.',
    author: 'خانم ر. م.',
  },
  {
    text: 'بهترین هدیه‌ای که تا به حال خریده‌ام.',
    author: 'آقای ک. الف.',
  },
]

const SLIDE_DURATION = 6000

export default function TestimonialSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length)
    }, SLIDE_DURATION)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="py-20 md:py-28 px-4 bg-[#FDFBF7]">
      <div className="max-w-4xl mx-auto text-center">
        <Quote className="w-10 h-10 md:w-12 md:h-12 text-[#D4AF37]/50 mx-auto mb-8" aria-hidden />
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
          >
            <blockquote className="font-[var(--font-playfair)] text-xl md:text-2xl lg:text-3xl font-light text-[#2C2C2C] leading-relaxed">
              «{TESTIMONIALS[index].text}»
            </blockquote>
            <p className="mt-6 text-[#2C2C2C]/70 text-sm font-medium">
              — {TESTIMONIALS[index].author}
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-2 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-[#D4AF37]' : 'w-1.5 bg-[#E5E0D9] hover:bg-[#D4AF37]/50'
              }`}
              aria-label={`گواهی ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
