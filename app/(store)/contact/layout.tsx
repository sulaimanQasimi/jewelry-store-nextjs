import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تماس با ما',
  description: 'با ما در ارتباط باشید. آدرس، تلفن و ایمیل بوتیک مایسون.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
