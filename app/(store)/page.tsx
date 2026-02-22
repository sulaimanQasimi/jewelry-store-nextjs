'use client'

import HeroSection from '@/components/store/home/HeroSection'
import BentoGrid from '@/components/store/home/BentoGrid'
import ProductShowcase from '@/components/store/home/ProductShowcase'
import CraftsmanshipSection from '@/components/store/home/CraftsmanshipSection'
import TestimonialSlider from '@/components/store/home/TestimonialSlider'
import TrustedByStrip from '@/components/store/home/TrustedByStrip'
import CtaStrip from '@/components/store/home/CtaStrip'

export default function HomePage() {
  return (
    <div className="store-home">
      <HeroSection />
      <BentoGrid />
      <ProductShowcase />
      <CraftsmanshipSection />
      <TestimonialSlider />
      <TrustedByStrip />
      <CtaStrip />
    </div>
  )
}
