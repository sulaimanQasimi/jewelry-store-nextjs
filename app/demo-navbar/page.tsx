'use client'

import React from 'react'
import FloatingNavbar3D from '@/components/FloatingNavbar3D'
import { Home, LayoutDashboard, Package, ShoppingCart, FileText } from 'lucide-react'

export default function DemoNavbarPage() {
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
        Gemify
      </span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navbar */}
      <FloatingNavbar3D links={navLinks} logo={logo} />

      {/* Demo Content */}
      <div className="pt-32 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              3D Floating Navbar Demo
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              A modern, responsive navbar with glassmorphism and 3D effects
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                Glassmorphism Effect
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Beautiful backdrop blur with semi-transparent background for a modern glass effect.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                3D Transform Effects
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Links pop forward in 3D space on hover with smooth transitions and depth perception.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                Dynamic Shadows
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Shadows shift based on mouse position and 3D tilt to enhance the depth effect.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                Fully Responsive
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Collapses into a mobile-friendly menu on smaller screens with smooth animations.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              How to Use
            </h3>
            <div className="space-y-3 text-slate-600 dark:text-slate-400">
              <p>
                <strong className="text-slate-800 dark:text-slate-200">1. Import the component:</strong>
              </p>
              <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg text-sm overflow-x-auto">
                {`import FloatingNavbar3D from '@/components/FloatingNavbar3D'`}
              </pre>
              
              <p className="mt-4">
                <strong className="text-slate-800 dark:text-slate-200">2. Use in your layout:</strong>
              </p>
              <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg text-sm overflow-x-auto">
                {`<FloatingNavbar3D 
  links={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
  ]}
  logo={<YourLogo />}
/>`}
              </pre>
            </div>
          </div>

          {/* Interactive Demo Section */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-900/20 dark:to-gold-800/20 border border-gold-200 dark:border-gold-800/50">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">
              Try It Out!
            </h3>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
              Hover over the navbar links above to see the 3D pop effect. Move your mouse around the navbar to see the dynamic shadow shift.
            </p>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                Hover over navigation links to see them pop forward
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                Move your mouse around the navbar to see shadow movement
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                Resize your browser to see the responsive mobile menu
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
