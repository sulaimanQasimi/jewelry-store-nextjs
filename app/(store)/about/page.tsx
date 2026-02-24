import { Gem, Award, Heart } from 'lucide-react'

export const metadata = {
  title: 'دربارهٔ ما | Gemify',
  description: 'اصالت هنر و تعهد به ظرافت ماندگار.',
}

export default function AboutPage() {
  return (
    <div className="store-about">
      <section className="relative min-h-[50vh] flex flex-col justify-center pt-24 pb-24 md:pt-32 md:pb-32 px-4 bg-[#0C0C0C] text-white text-center">
        <p className="font-[var(--font-playfair)] text-[#D4AF37] tracking-[0.35em] text-xs mb-3 uppercase">از همان آغاز</p>
        <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">هنر و اصالت</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
          هر قطعه‌ای که می‌سازیم گواه نسل‌ها مهارت، عشق و پایبندی به برتری است.
        </p>
      </section>

      <section className="py-20 md:py-28 px-4 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <p className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-semibold mb-4">داستان ما</p>
              <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-light text-[#0C0C0C] mb-6 tracking-tight">جواهر برای ماندن</h2>
              <p className="text-[#0C0C0C]/80 leading-relaxed mb-4">
                از یک کارگاه کوچک تا خانه‌ای شناخته‌شده برای ظرافت، به یک اصل وفادار مانده‌ایم:
                جواهر باید برای ماندن ساخته شود، در سبک و در روح.
              </p>
              <p className="text-[#2C2C2C]/80 leading-relaxed">
                استادکاران ما سنت و طراحی امروز را با هم می‌آمیزند تا هر قطعه هم ماندگار و هم به‌راستی از آنِ ما باشد.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-none bg-[#0C0C0C] flex items-center justify-center">
              <Gem className="w-24 h-24 text-[#D4AF37]/40" aria-hidden />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-4 bg-[#0C0C0C] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="order-2 md:order-1 aspect-[4/3] rounded-none bg-white/5 flex items-center justify-center border border-white/10">
              <Award className="w-24 h-24 text-[#D4AF37]/50" aria-hidden />
            </div>
            <div className="order-1 md:order-2">
              <p className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-semibold mb-4">هنر ساخت</p>
              <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-light mb-6 tracking-tight">تنها بهترین مواد</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                تنها بهترین مواد را برمی‌گزینیم و با دست از مرصع تا صیقل کار می‌کنیم تا هر
                جزئیات به استانداردهایمان برسد.
              </p>
              <p className="text-white/80 leading-relaxed">
                هنرمندان ما سال‌ها در روش‌های سنتی و امروزی آموزش دیده‌اند و اصالت و نوآوری را با هم می‌آمیزند.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-4 bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-12 h-12 text-[#D4AF37]/60 mx-auto mb-6" aria-hidden />
          <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-light text-[#0C0C0C] mb-6 tracking-tight">وعدهٔ ما</h2>
          <p className="text-[#0C0C0C]/80 leading-relaxed">
            باور داریم جواهری بسازیم که بخشی از داستان شما شود—ظریف، ماندگار و با دقت ساخته‌شده.
          </p>
        </div>
      </section>
    </div>
  )
}
