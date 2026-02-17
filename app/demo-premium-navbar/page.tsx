'use client'

import React from 'react'
import PremiumNavbar from '@/components/PremiumNavbar'
import { Home, LayoutDashboard, Package, ShoppingCart, FileText, Settings } from 'lucide-react'

export default function DemoPremiumNavbarPage() {
  const navLinks = [
    { label: 'خانه', href: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'داشبورد', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'محصولات', href: '/products', icon: <Package className="w-4 h-4" /> },
    { label: 'فروش', href: '/sales', icon: <ShoppingCart className="w-4 h-4" /> },
    { label: 'گزارشات', href: '/report', icon: <FileText className="w-4 h-4" /> },
  ]

  const logo = (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold text-sm">
        J
      </div>
      <span className="hidden md:block text-sm font-bold text-slate-800 dark:text-slate-200">
        Jewelry Store
      </span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Premium Navbar */}
      <PremiumNavbar 
        links={navLinks} 
        logo={logo}
        primaryCTA={{
          label: 'شروع کنید',
          onClick: () => alert('CTA Clicked!')
        }}
      />

      {/* Demo Content */}
      <div className="pt-8 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Premium Navbar Design
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Advanced glassmorphism with micro-interactions and smooth animations
            </p>
          </div>

          {/* Scroll to see background transition */}
          <div className="mb-12 p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              ✨ Scroll Effect
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Scroll down to see the navbar background smoothly transition to a more opaque state.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                🎨 Glassmorphism Effect
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Beautiful backdrop blur with multi-layered shadows for premium depth and visual hierarchy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                🎯 Spring Animations
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Smooth spring animations on hover with cubic-bezier easing for delightful micro-interactions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                📍 Expanding Underline
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Navigation links feature an elegant underline that expands from the center on hover.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                🔍 Expandable Search
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Sleek search bar that smoothly expands when clicked, with focus states and animations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                🎨 Gradient CTA Button
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Primary CTA button with vibrant gradient background and scale effect on hover.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                📱 Fully Responsive
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Mobile-optimized hamburger menu with smooth transitions and touch-friendly interactions.
              </p>
            </div>
          </div>

          {/* Spacer for scroll demo */}
          <div className="space-y-8 mb-12">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/30"
              >
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Content Section {i + 1}
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Scroll through this content to see the navbar background transition effect. The navbar
                  becomes more opaque as you scroll, creating a premium floating effect.
                </p>
              </div>
            ))}
          </div>

          {/* Usage Instructions */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-900/20 dark:to-gold-800/20 border border-gold-200 dark:border-gold-800/50">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              How to Use
            </h3>
            <div className="space-y-3 text-slate-700 dark:text-slate-300">
              <p>
                <strong className="text-slate-800 dark:text-slate-200">1. Import the component:</strong>
              </p>
              <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg text-sm overflow-x-auto">
                {`import PremiumNavbar from '@/components/PremiumNavbar'`}
              </pre>
              
              <p className="mt-4">
                <strong className="text-slate-800 dark:text-slate-200">2. Use in your layout:</strong>
              </p>
              <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg text-sm overflow-x-auto">
                {`<PremiumNavbar 
  links={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]}
  logo={<YourLogo />}
  primaryCTA={{
    label: 'Get Started',
    onClick: () => handleClick()
  }}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
