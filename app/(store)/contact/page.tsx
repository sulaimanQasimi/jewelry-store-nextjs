'use client'

import { useState } from 'react'
import { MapPin, Mail, Phone, Instagram, Facebook } from 'lucide-react'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 800))
    setStatus('sent')
  }

  return (
    <div className="store-contact">
      <section className="relative min-h-[40vh] flex flex-col justify-center pt-24 pb-20 md:pt-28 md:pb-28 px-4 bg-[#0C0C0C] text-white text-center">
        <p className="font-[var(--font-playfair)] text-[#D4AF37] tracking-[0.35em] text-xs mb-3 uppercase">
          با ما در ارتباط باشید
        </p>
        <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl font-light tracking-tight">
          تماس با ما
        </h1>
      </section>

      <section className="py-16 md:py-24 px-4 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 md:gap-16">
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold tracking-widest uppercase text-[#0C0C0C]/80 mb-2">
                    نام <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3.5 border border-[#0C0C0C]/15 bg-white text-[#0C0C0C] focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-colors rounded-none"
                    placeholder="نام شما"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold tracking-widest uppercase text-[#0C0C0C]/80 mb-2">
                    ایمیل <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3.5 border border-[#0C0C0C]/15 bg-white text-[#0C0C0C] focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-colors rounded-none"
                    placeholder="example@mail.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold tracking-widest uppercase text-[#0C0C0C]/80 mb-2">
                    پیام <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3.5 border border-[#0C0C0C]/15 bg-white text-[#0C0C0C] focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-colors resize-y rounded-none"
                    placeholder="چگونه می‌توانیم کمک کنیم؟"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center min-w-[180px] px-8 py-4 text-xs font-semibold tracking-widest uppercase bg-[#0C0C0C] text-white hover:bg-[#D4AF37] hover:text-[#0C0C0C] transition-all duration-300 disabled:opacity-60 rounded-none"
                >
                  {status === 'sending' ? 'در حال ارسال…' : status === 'sent' ? 'پیام ارسال شد' : 'ارسال پیام'}
                </button>
                {status === 'error' && (
                  <p className="text-sm text-red-600">خطایی رخ داد. لطفاً دوباره تلاش کنید.</p>
                )}
              </form>
            </div>

            <div className="md:col-span-2 space-y-10">
              <div>
                <h2 className="font-[var(--font-playfair)] text-lg font-medium text-[#0C0C0C] mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  شعبه‌های بوتیک
                </h2>
                <ul className="space-y-3 text-[#0C0C0C]/75 text-sm leading-relaxed">
                  <li>
                    <span className="font-semibold text-[#0C0C0C]">شعبهٔ اصلی</span><br />
                    ۱۲۳ خیابان ستارگان، نیویورک
                  </li>
                  <li className="pt-3 border-t border-[#0C0C0C]/10">
                    <span className="font-semibold text-[#0C0C0C]">بوتیک</span><br />
                    ۴۵۶ رودهو درایو، بورلی هیلز
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="font-[var(--font-playfair)] text-lg font-medium text-[#0C0C0C] mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                  ایمیل
                </h2>
                <a href="mailto:hello@gemify.com" className="text-[#0C0C0C]/75 hover:text-[#D4AF37] transition-colors">
                  hello@gemify.com
                </a>
              </div>
              <div>
                <h2 className="font-[var(--font-playfair)] text-lg font-medium text-[#0C0C0C] mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                  تلفن
                </h2>
                <a href="tel:+15551234567" className="text-[#0C0C0C]/75 hover:text-[#D4AF37] transition-colors">
                  +1 (555) 123-4567
                </a>
              </div>
              <div>
                <h2 className="font-[var(--font-playfair)] text-lg font-medium text-[#0C0C0C] mb-3">ما را دنبال کنید</h2>
                <div className="flex gap-3">
                  <a href="#" className="p-2.5 border border-[#0C0C0C]/15 text-[#0C0C0C]/70 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors rounded-none" aria-label="اینستاگرام">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2.5 border border-[#0C0C0C]/15 text-[#0C0C0C]/70 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors rounded-none" aria-label="فیسبوک">
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
