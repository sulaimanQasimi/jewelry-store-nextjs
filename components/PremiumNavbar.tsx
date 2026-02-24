'use client'

import React, { useState, useEffect, useContext, useRef } from 'react'
import { Menu, X, DatabaseBackup, LogOut, Maximize, Minimize } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '@/lib/context/AppContext'
import StorageRate from './StorageRate'
import ThemeToggle from './ThemeToggle'

interface NavLink {
  label: string
  href: string
  icon?: React.ReactNode
}

interface PremiumNavbarProps {
  links?: NavLink[]
  logo?: React.ReactNode
  className?: string
  primaryCTA?: {
    label: string
    onClick: () => void
  }
}

// NavLink Component with Spring Animation and Expanding Underline
const PremiumNavLink: React.FC<{ link: NavLink }> = ({ link }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={link.href}
      className="relative px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-all duration-300 cursor-pointer"
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10 flex items-center gap-2">
        {link.icon && <span>{link.icon}</span>}
        {link.label}
      </span>
      
      {/* Expanding Underline from Center */}
      <span
        className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-gold-500 to-gold-600 dark:from-gold-400 dark:to-gold-500 transition-all duration-300"
        style={{
          width: isHovered ? '100%' : '0%',
          left: isHovered ? '0%' : '50%',
          transform: isHovered ? 'translateX(0)' : 'translateX(-50%)',
        }}
      />
    </a>
  )
}

// Primary CTA Button Component
const PrimaryCTA: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      className="relative px-6 py-2.5 rounded-full text-sm font-semibold text-white overflow-hidden transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, #FFAF00 0%, #FF8C00 50%, #FF6B00 100%)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: isHovered
          ? '0 10px 25px -5px rgba(255, 175, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
          : '0 4px 12px -2px rgba(255, 175, 0, 0.3)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10">{label}</span>
      <div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
        }}
      />
    </button>
  )
}

// Main Premium Navbar Component
const PremiumNavbar: React.FC<PremiumNavbarProps> = ({
  links = [],
  logo,
  className = '',
  primaryCTA,
}) => {
  const { companyData } = useContext(AppContext)
  const { data: session } = useSession()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  const handleBackup = async () => {
    try {
      const { data } = await axios.post('/api/backup/backup')
      if (data.success) toast.success(data.message)
    } catch (error: any) {
      toast.error(error?.message)
    }
  }

  const defaultLogo = Array.isArray(companyData) && companyData[0]?.image 
    ? `/${companyData[0].image}` 
    : '/assets/logo.svg'

  // Scroll detection for background transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative rounded-2xl px-4 md:px-6 py-3 md:py-4 backdrop-blur-md border transition-all duration-300 ${
            isScrolled
              ? 'bg-white/80 dark:bg-slate-900/80 border-white/40 dark:border-slate-700/40'
              : 'bg-white/60 dark:bg-slate-900/60 border-white/30 dark:border-slate-700/30'
          }`}
          style={{
            boxShadow: isScrolled
              ? '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
              : '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
          }}
        >
          <div className="flex items-center justify-between">
            {/* Left Section: Logo & Welcome */}
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              {/* Logo */}
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="group relative rounded-full p-1 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-300 to-gold-500 blur opacity-40 group-hover:opacity-70 transition-opacity" />
                {logo ? (
                  <div className="relative h-10 w-10 flex items-center justify-center">
                    {logo}
                  </div>
                ) : (
                  <img
                    src={defaultLogo}
                    alt="Logo"
                    className="relative h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                )}
              </button>

              {/* Welcome Message */}
              {session?.user?.name && (
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs text-gold-600 dark:text-gold-400 font-semibold mb-[-2px]">
                    خوش آمدید،
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    {session.user.name}
                  </span>
                </div>
              )}
            </div>

            {/* Center Section: Navigation Links */}
            {links.length > 0 && (
              <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                {links.map((link, index) => (
                  <PremiumNavLink key={index} link={link} />
                ))}
              </div>
            )}

            {/* Right Section: Actions */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              {/* Storage Rate */}
              <div className="hidden md:block">
                <StorageRate />
              </div>

              {/* Divider */}
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-600 mx-1 hidden md:block" />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-100/50 dark:border-slate-700/50"
                title={isFullscreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه'}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5 transition-transform group-hover:scale-110" />
                ) : (
                  <Maximize className="h-5 w-5 transition-transform group-hover:scale-110" />
                )}
              </button>

              {/* Backup Button */}
              <button
                type="button"
                onClick={handleBackup}
                className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-100/50 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-700"
                title="پشتیبان‌گیری"
              >
                <DatabaseBackup className="h-5 w-5 transition-transform group-hover:rotate-12" />
              </button>

              {/* Primary CTA Button */}
              {primaryCTA && (
                <>
                  <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-600 mx-1 hidden md:block" />
                  <PrimaryCTA label={primaryCTA.label} onClick={primaryCTA.onClick} />
                </>
              )}

              {/* Logout Button */}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="group flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 px-2 md:px-3 py-2 text-sm font-medium text-red-500 dark:text-red-400 transition-all hover:bg-red-500 dark:hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50 border border-red-50 dark:border-red-900/30 hover:border-red-400 dark:hover:border-red-500"
                title="خروج"
              >
                <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                <span className="hidden md:inline">خروج</span>
              </button>

              {/* Mobile Menu Button */}
              {links.length > 0 && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && links.length > 0 && (
          <div
            className="mt-4 rounded-2xl backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border border-white/50 dark:border-slate-700/50 overflow-hidden transition-all duration-300"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="py-4">
              {/* Mobile Links */}
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon && <span>{link.icon}</span>}
                  {link.label}
                </a>
              ))}

              {/* Mobile Actions */}
              <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2 px-4 space-y-2">
                <div className="md:hidden">
                  <StorageRate />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default PremiumNavbar
