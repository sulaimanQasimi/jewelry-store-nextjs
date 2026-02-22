import { Gem, Award, Heart } from 'lucide-react'

export const metadata = {
  title: 'دربارهٔ ما | جواهرات مایسون',
  description: 'اصالت هنر و تعهد به ظرافت ماندگار.',
}

export default function AboutPage() {
  return (
    <div className="store-about">
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-4 bg-cream-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-serif text-[#D4AF37] tracking-[0.3em] text-sm mb-4">
            از همان آغاز
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#2C2C2C] tracking-tight mb-6">
            هنر و اصالت
          </h1>
          <p className="text-[#2C2C2C]/80 text-lg leading-relaxed max-w-2xl mx-auto">
            هر قطعه‌ای که می‌سازیم گواه نسل‌ها مهارت، عشق و پایبندی به برتری است.
          </p>
        </div>
      </section>

      {/* Story blocks */}
      <section className="py-16 md:py-24 px-4 bg-cream-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-[#2C2C2C] mb-6">
                داستان ما
              </h2>
              <p className="text-[#2C2C2C]/80 leading-relaxed mb-4">
                از یک کارگاه کوچک تا خانه‌ای شناخته‌شده برای ظرافت، به یک اصل وفادار مانده‌ایم:
                جواهر باید برای ماندن ساخته شود، در سبک و در روح.
              </p>
              <p className="text-[#2C2C2C]/80 leading-relaxed">
                استادکاران ما سنت و طراحی امروز را با هم می‌آمیزند تا هر قطعه هم ماندگار و هم
                به‌راستی از آنِ ما باشد.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-sm bg-cream-200 border border-cream-300 flex items-center justify-center">
              <Gem className="w-24 h-24 text-[#D4AF37]/40" aria-hidden />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-cream-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1 aspect-[4/3] rounded-sm bg-cream-200 border border-cream-300 flex items-center justify-center">
              <Award className="w-24 h-24 text-[#D4AF37]/40" aria-hidden />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-serif text-2xl md:text-3xl font-light text-[#2C2C2C] mb-6">
                هنر ساخت
              </h2>
              <p className="text-[#2C2C2C]/80 leading-relaxed mb-4">
                تنها بهترین مواد را برمی‌گزینیم و با دست از مرصع تا صیقل کار می‌کنیم تا هر
                جزئیات به استانداردهایمان برسد.
              </p>
              <p className="text-[#2C2C2C]/80 leading-relaxed">
                هنرمندان ما سال‌ها در روش‌های سنتی و امروزی آموزش دیده‌اند و اصالت و نوآوری را
                با هم می‌آمیزند تا قطعاتی بیافرینند که نسل‌ها حفظشان می‌کنند.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-cream-50">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-12 h-12 text-[#D4AF37]/60 mx-auto mb-6" aria-hidden />
          <h2 className="font-serif text-2xl md:text-3xl font-light text-[#2C2C2C] mb-6">
            وعدهٔ ما
          </h2>
          <p className="text-[#2C2C2C]/80 leading-relaxed">
            باور داریم جواهری بسازیم که بخشی از داستان شما شود—ظریف، ماندگار و با دقت ساخته‌شده.
            از اینکه بخشی از داستان ما هستید سپاسگزاریم.
          </p>
        </div>
      </section>
    </div>
  )
}
