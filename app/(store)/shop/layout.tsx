import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'مجموعه | جواهرات مایسون',
  description: 'مجموعهٔ جواهرات ناب. انگشتر، گردنبند، دست‌بند و بیشتر.',
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
