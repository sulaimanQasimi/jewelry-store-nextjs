'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CurrencyRatesRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/currencies')
  }, [router])
  return (
    <div className="flex items-center justify-center min-h-[200px] text-charcoal-soft">
      در حال انتقال به مدیریت ارزها...
    </div>
  )
}
