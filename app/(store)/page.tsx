'use client'

import Link from 'next/link'
import { ArrowLeft, Quote } from 'lucide-react'
import Button from '@/components/store/Button'

export default function HomePage() {
  return (
    <div className="store-home">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 bg-cream-100 overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="font-serif text-[#D4AF37] tracking-[0.3em] text-sm mb-4">
            مجموعهٔ جدید
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#2C2C2C] tracking-tight mb-6">
            ظرافت جاودان
            <br />
            <span className="text-[#D4AF37]">ساخته‌شده برای همیشه</span>
          </h1>
          <p className="text-[#2C2C2C]/80 text-lg max-w-xl mx-auto mb-10">
            قطعات تازهٔ ما را کشف کنید؛ جایی که اصالت با طراحی امروزی درمی‌آمیزد.
          </p>
          <Link href="/shop">
            <Button variant="gold" size="lg" leftIcon={ArrowLeft}>
              دیدن مجموعه
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 md:py-28 px-4 bg-cream-50">
        <div className="max-w-7xl mx-auto">
          <p className="font-serif text-[#D4AF37] tracking-[0.2em] text-sm text-center mb-2">
            گزیده
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-[#2C2C2C] text-center mb-14">
            مجموعه‌های برگزیده
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'انگشتر', href: '/shop?category=rings', image: '◆' },
              { title: 'گردنبند', href: '/shop?category=necklaces', image: '◇' },
              { title: 'دست‌بند', href: '/shop?category=bracelets', image: '○' },
            ].map((col) => (
              <Link
                key={col.title}
                href={col.href}
                className="group block aspect-[4/5] rounded-sm overflow-hidden bg-cream-200 border border-cream-300 shadow-md hover:shadow-xl transition-all duration-500"
              >
                <div className="h-full flex flex-col justify-end p-8 bg-gradient-to-t from-[#2C2C2C]/80 to-transparent">
                  <span className="font-serif text-6xl text-cream-50/20 absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500">
                    {col.image}
                  </span>
                  <h3 className="font-serif text-2xl text-cream-50 relative z-10 group-hover:text-[#D4AF37] transition-colors">
                    {col.title}
                  </h3>
                  <span className="text-cream-50/80 text-sm mt-1 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    مشاهدهٔ مجموعه
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 px-4 bg-cream-100">
        <div className="max-w-4xl mx-auto text-center">
          <Quote className="w-12 h-12 text-[#D4AF37]/50 mx-auto mb-6" aria-hidden />
          <blockquote className="font-serif text-2xl md:text-3xl font-light text-[#2C2C2C] leading-relaxed">
            «صنعت و طراحی بی‌زمان. هر قطعه داستانی دارد.»
          </blockquote>
          <p className="mt-6 text-[#2C2C2C]/70 font-medium">— مشتریان ما</p>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-12 px-4 bg-[#2C2C2C] text-cream-50 text-center">
        <p className="font-serif text-lg mb-2">آمادهٔ یافتن قطعهٔ خود هستید؟</p>
        <Link href="/contact">
          <Button variant="gold" size="md">
            تماس با ما
          </Button>
        </Link>
      </section>
    </div>
  )
}
