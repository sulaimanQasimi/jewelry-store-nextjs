import { Gem, Award, Heart } from 'lucide-react'

export const metadata = {
  title: 'About Us | Maison Jewelry',
  description: 'Our heritage of craftsmanship and dedication to timeless elegance.',
}

export default function AboutPage() {
  return (
    <div className="store-about">
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-4 bg-cream-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-serif text-[#D4AF37] tracking-[0.3em] uppercase text-sm mb-4">
            Since the beginning
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#2C2C2C] tracking-tight mb-6">
            Craftsmanship & Heritage
          </h1>
          <p className="text-[#2C2C2C]/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Every piece we create is a testament to generations of skill, passion, and an unwavering
            commitment to excellence.
          </p>
        </div>
      </section>

      {/* Story blocks */}
      <section className="py-16 md:py-24 px-4 bg-cream-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-[#2C2C2C] mb-6">
                Our Story
              </h2>
              <p className="text-[#2C2C2C]/80 leading-relaxed mb-4">
                From a small atelier to a house recognized for elegance, we have stayed true to one
                principle: jewelry should be made to last, in style and in spirit.
              </p>
              <p className="text-[#2C2C2C]/80 leading-relaxed">
                Our master artisans combine traditional techniques with contemporary design, ensuring
                each piece is both timeless and distinctly ours.
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
                The Art of Making
              </h2>
              <p className="text-[#2C2C2C]/80 leading-relaxed mb-4">
                We source only the finest materials and work them by hand—from setting to polish—so
                that every detail meets our exacting standards.
              </p>
              <p className="text-[#2C2C2C]/80 leading-relaxed">
                Our craftspeople train for years in traditional and modern methods, blending heritage
                with innovation to create pieces that will be treasured for generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-cream-50">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-12 h-12 text-[#D4AF37]/60 mx-auto mb-6" aria-hidden />
          <h2 className="font-serif text-2xl md:text-3xl font-light text-[#2C2C2C] mb-6">
            Our Promise
          </h2>
          <p className="text-[#2C2C2C]/80 leading-relaxed">
            We believe in creating jewelry that becomes part of your story—elegant, enduring, and
            made with care. Thank you for being part of ours.
          </p>
        </div>
      </section>
    </div>
  )
}
