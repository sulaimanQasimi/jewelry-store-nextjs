'use client'

import React, { useState, useEffect, useContext } from 'react'
import { Menu, X, DatabaseBackup, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import CurrencyExchange from './CurrencyExchange'
import { AppContext } from '@/lib/context/AppContext'
import StorageRate from './StorageRate'
import ThemeToggle from './ThemeToggle'

interface NavLink {
  label: string
  href: string
  icon?: React.ReactNode
}

interface FloatingNavbar3DProps {
  links?: NavLink[]
  logo?: React.ReactNode
  className?: string
}

const FloatingNavbar3D: React.FC<FloatingNavbar3DProps> = ({
  links = [],
  logo,
  className = '',
}) => {
  const { companyData } = useContext(AppContext)
  const { data: session } = useSession()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

  useEffect(() => {
    let rafId: number | null = null
    
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId)
      
      rafId = requestAnimationFrame(() => {
        const nav = document.querySelector('[data-nav-3d]') as HTMLElement
        if (nav) {
          const rect = nav.getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2
          setMousePosition({ x, y })
        }
      })
    }

    const nav = document.querySelector('[data-nav-3d]')
    if (nav) {
      nav.addEventListener('mousemove', handleMouseMove as EventListener)
      return () => {
        nav.removeEventListener('mousemove', handleMouseMove as EventListener)
        if (rafId) cancelAnimationFrame(rafId)
      }
    }
  }, [])

  // Calculate dynamic shadow based on tilt and mouse position
  const shadowX = mousePosition.x * 0.05
  const shadowY = mousePosition.y * 0.05 + 15 // Base offset for 3D tilt

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 ${className}`}
      style={{
        perspective: '1200px',
      }}
    >
      {/* 3D Container */}
      <div
        data-nav-3d
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1200px) rotateX(8deg) rotateY(${mousePosition.x * 0.01}deg)`,
          transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Main Navbar Pill */}
        <div
          className="relative rounded-full px-4 md:px-8 py-3 md:py-4 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/40 dark:border-slate-700/40 transition-all duration-300"
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: `${shadowX}px ${shadowY}px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset`,
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center justify-between" style={{ transformStyle: 'preserve-3d' }}>
            {/* Left Section: Logo & Welcome */}
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              {/* Logo */}
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="group relative rounded-full p-1 transition-all duration-300 hover:scale-105"
                style={{ transformStyle: 'preserve-3d' }}
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
                <div className="hidden sm:flex flex-col" style={{ transformStyle: 'preserve-3d' }}>
                  <span className="text-xs text-gold-600 dark:text-gold-400 font-semibold mb-[-2px]">خوش آمدید،</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    {session.user.name}
                  </span>
                </div>
              )}
            </div>

            {/* Center Section: Desktop Navigation Links */}
            {links.length > 0 && (
              <div className="hidden md:flex items-center gap-1 md:gap-2 flex-1 justify-center" style={{ transformStyle: 'preserve-3d' }}>
                {links.map((link, index) => (
                  <NavLink3D key={index} link={link} />
                ))}
              </div>
            )}

            {/* Right Section: Actions */}
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0" style={{ transformStyle: 'preserve-3d' }}>
              {/* Storage Rate */}
              <div className="hidden md:block" style={{ transformStyle: 'preserve-3d' }}>
                <StorageRate />
              </div>

              {/* Divider */}
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-600 mx-1 hidden md:block"></div>

              {/* Theme Toggle */}
              <div style={{ transformStyle: 'preserve-3d' }}>
                <ThemeToggle />
              </div>

              {/* Backup Button */}
              <button
                type="button"
                onClick={handleBackup}
                className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-100/50 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-700"
                title="پشتیبان‌گیری"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateZ(15px) scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateZ(0px) scale(1)'
                }}
              >
                <DatabaseBackup className="h-5 w-5 transition-transform group-hover:rotate-12" />
              </button>

              {/* Currency Exchange */}
              <div className="hidden md:block" style={{ transformStyle: 'preserve-3d' }}>
                <CurrencyExchange isCurrencyToggle={false} />
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="group flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 px-2 md:px-3 py-2 text-sm font-medium text-red-500 dark:text-red-400 transition-all hover:bg-red-500 dark:hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50 border border-red-50 dark:border-red-900/30 hover:border-red-400 dark:hover:border-red-500"
                title="خروج"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateZ(15px) scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateZ(0px) scale(1)'
                }}
              >
                <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                <span className="hidden md:inline">خروج</span>
              </button>

              {/* Mobile Menu Button - Only show if there are links */}
              {links.length > 0 && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                  aria-label="Toggle menu"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
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
            className="absolute top-full left-0 right-0 mt-4 rounded-2xl backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border border-white/50 dark:border-slate-700/50 overflow-hidden"
            style={{
              transform: 'translateZ(30px)',
              transformStyle: 'preserve-3d',
              boxShadow: `${shadowX * 0.5}px ${shadowY + 10}px 50px rgba(0, 0, 0, 0.25)`,
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="py-4">
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
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

interface NavLink3DProps {
  link: NavLink
}

const NavLink3D: React.FC<NavLink3DProps> = ({ link }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={link.href}
      className="relative px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 transition-all duration-300 cursor-pointer"
      style={{
        transform: isHovered ? 'translateZ(25px) scale(1.05)' : 'translateZ(0px) scale(1)',
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background glow effect on hover */}
      <span
        className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-400/30 to-gold-600/30 dark:from-gold-500/40 dark:to-gold-700/40 transition-opacity duration-300 blur-md"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateZ(15px) scale(1.2)' : 'translateZ(0px) scale(1)',
          transformStyle: 'preserve-3d',
        }}
      />
      
      {/* Link text */}
      <span className="relative z-10 flex items-center gap-1 md:gap-2" style={{ transformStyle: 'preserve-3d' }}>
        {link.icon && <span style={{ transform: isHovered ? 'translateZ(5px)' : 'translateZ(0px)' }}>{link.icon}</span>}
        <span style={{ transform: isHovered ? 'translateZ(5px)' : 'translateZ(0px)' }}>{link.label}</span>
      </span>

      {/* Active indicator dot */}
      <span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold-500 dark:bg-gold-400 transition-all duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered 
            ? 'translateZ(20px) scale(1.8) translateY(-2px)' 
            : 'translateZ(0px) scale(0) translateY(0px)',
          transformStyle: 'preserve-3d',
          boxShadow: isHovered ? '0 0 8px rgba(255, 175, 0, 0.6)' : 'none',
        }}
      />
    </a>
  )
}

export default FloatingNavbar3D
