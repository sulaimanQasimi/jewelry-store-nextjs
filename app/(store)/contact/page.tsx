'use client'

import { useState } from 'react'
import { MapPin, Mail, Phone, Instagram, Facebook } from 'lucide-react'
import Button from '@/components/store/Button'

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
      <section className="py-12 md:py-16 px-4 bg-cream-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-serif text-[#D4AF37] tracking-[0.2em] text-sm mb-2">
            با ما در ارتباط باشید
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-[#2C2C2C]">
            تماس با ما
          </h1>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 bg-cream-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 md:gap-14">
            {/* Form */}
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    نام <span className="text-red-500" aria-hidden>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-cream-300 rounded-sm bg-white text-[#2C2C2C] focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-colors"
                    placeholder="نام شما"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    ایمیل <span className="text-red-500" aria-hidden>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-cream-300 rounded-sm bg-white text-[#2C2C2C] focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-colors"
                    placeholder="example@mail.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                    پیام <span className="text-red-500" aria-hidden>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-cream-300 rounded-sm bg-white text-[#2C2C2C] focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-colors resize-y"
                    placeholder="چگونه می‌توانیم کمک کنیم؟"
                  />
                </div>
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'در حال ارسال…' : status === 'sent' ? 'پیام ارسال شد' : 'ارسال پیام'}
                </Button>
                {status === 'error' && (
                  <p className="text-sm text-red-600">خطایی رخ داد. لطفاً دوباره تلاش کنید.</p>
                )}
              </form>
            </div>

            {/* Boutique & social */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="font-serif text-xl font-medium text-[#2C2C2C] mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  شعبه‌های بوتیک
                </h2>
                <ul className="space-y-3 text-[#2C2C2C]/80">
                  <li>
                    <span className="font-medium text-[#2C2C2C]">شعبهٔ اصلی</span>
                    <br />
                    ۱۲۳ خیابان ستارگان
                    <br />
                    نیویورک، نیویورک ۱۰۰۰۱
                  </li>
                  <li className="pt-2 border-t border-cream-200">
                    <span className="font-medium text-[#2C2C2C]">بوتیک</span>
                    <br />
                    ۴۵۶ رودهو درایو
                    <br />
                    بورلی هیلز، کالیفرنیا ۹۰۲۱۰
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-xl font-medium text-[#2C2C2C] mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                  ایمیل
                </h2>
                <a href="mailto:hello@maison.com" className="text-[#2C2C2C]/80 hover:text-[#D4AF37] transition-colors">
                  hello@maison.com
                </a>
              </div>
              <div>
                <h2 className="font-serif text-xl font-medium text-[#2C2C2C] mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                  تلفن
                </h2>
                <a href="tel:+15551234567" className="text-[#2C2C2C]/80 hover:text-[#D4AF37] transition-colors">
                  +1 (555) 123-4567
                </a>
              </div>
              <div>
                <h2 className="font-serif text-xl font-medium text-[#2C2C2C] mb-4">ما را دنبال کنید</h2>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="p-2 rounded-sm border border-cream-300 text-[#2C2C2C] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                    aria-label="اینستاگرام"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-sm border border-cream-300 text-[#2C2C2C] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                    aria-label="فیسبوک"
                  >
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
