import {
  Database,
  Globe,
  Smartphone,
  Video,
  Network,
  Megaphone,
  Users,
  MapPin,
  Mail,
  Phone,
  Clock,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'دربارهٔ ما | شرکت گلکسی تکنولوژی',
  description:
    'شرکت گلکسی تکنولوژی ارائه‌دهنده راه‌حل‌های نرم‌افزاری و فناوری اطلاعات: پایگاه داده، وب، اپلیکیشن موبایل، دوربین مداربسته و شبکه.',
}

const SERVICES = [
  {
    icon: Database,
    titleEn: 'Database Development',
    titleFa: 'توسعه پایگاه داده',
  },
  {
    icon: Globe,
    titleEn: 'Web Development & Hosting',
    titleFa: 'توسعه وب و میزبانی',
  },
  {
    icon: Smartphone,
    titleEn: 'Mobile App Development',
    titleFa: 'توسعه اپلیکیشن موبایل',
  },
  {
    icon: Video,
    titleEn: 'CCTV Operation & Services',
    titleFa: 'دوربین مداربسته و خدمات',
  },
  {
    icon: Network,
    titleEn: 'Networking',
    titleFa: 'شبکه',
  },
  {
    icon: Megaphone,
    titleEn: 'Digital Marketing & Branding',
    titleFa: 'دیجیتال مارکتینگ و برندینگ',
  },
] as const

const PROCESS = [
  {
    step: '01',
    title: 'Initiation & Planning',
    titleFa: 'شروع و برنامه‌ریزی',
    desc: 'We initiate the project and the plan covers all aspects of the project.',
    descFa: 'پروژه را آغاز می‌کنیم و برنامه تمام جنبه‌های پروژه را پوشش می‌دهد.',
  },
  {
    step: '02',
    title: 'Execution & Development',
    titleFa: 'اجرا و توسعه',
    desc: 'We develop the project and execute multiple time.',
    descFa: 'پروژه را توسعه داده و در چند مرحله اجرا می‌کنیم.',
  },
  {
    step: '03',
    title: 'Testing & Maintenance',
    titleFa: 'تست و نگهداری',
    desc: 'Our testing team will test all aspects of the project.',
    descFa: 'تیم تست ما تمام جنبه‌های پروژه را بررسی می‌کند.',
  },
] as const

const TEAM = [
  { name: 'Masih Ahmadyar', role: 'Founder & CEO', roleFa: 'بنیان‌گذار و مدیرعامل' },
  { name: 'Sulaiman Qasimi', role: 'Full Stack Developer', roleFa: 'توسعه‌دهنده فول‌استک' },
  { name: 'Maroofa Habibi', role: 'Full Stack Developer', roleFa: 'توسعه‌دهنده فول‌استک' },
  { name: 'Adibullah Wakili', role: 'Marketing Officer', roleFa: 'مسئول بازاریابی' },
] as const

export default function AboutPage() {
  return (
    <div className="store-about" dir="rtl">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex flex-col justify-center pt-24 pb-24 md:pt-32 md:pb-32 px-4 bg-[#0C0C0C] text-white text-center">
        <p className="font-[var(--font-playfair)] text-[#D4AF37] tracking-[0.35em] text-xs mb-3 uppercase">
          Galaxy Technology Company
        </p>
        <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">
          دربارهٔ ما
        </h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
          ارائه‌دهنده راه‌حل‌های نرم‌افزاری و فناوری اطلاعات برای موفقیت کسب‌وکار شما.
        </p>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28 px-4 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-semibold mb-4">ما که هستیم</p>
          <h2 className="font-[var(--font-playfair)] text-2xl md:text-4xl font-light text-[#0C0C0C] mb-6 tracking-tight">
            راه‌حل‌های نرم‌افزاری و فناوری اطلاعات برای کسب‌وکار شما
          </h2>
          <p className="text-[#0C0C0C]/80 leading-relaxed max-w-3xl mx-auto mb-6">
            تیم متخصص ما آماده است تا بهترین خدمات فناوری را در اختیار شما قرار دهد. ما از آخرین فناوری‌ها
            برای ساخت پایگاه داده، وب‌سایت، اپلیکیشن موبایل و موارد دیگر برای کسب‌وکار شما استفاده می‌کنیم.
          </p>
          <ul className="flex flex-wrap justify-center gap-6 text-[#0C0C0C]/90 font-medium">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              تحویل با کیفیت تیم
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              پشتیبانی ۲۴/۷
            </li>
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28 px-4 bg-[#0C0C0C] text-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-semibold mb-4 text-center">
            خدمات ما
          </p>
          <h2 className="font-[var(--font-playfair)] text-2xl md:text-4xl font-light text-center mb-14 tracking-tight">
            خدمات حرفه‌ای برای موفقیت شما
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map(({ icon: Icon, titleEn, titleFa }) => (
              <div
                key={titleEn}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 transition-colors"
              >
                <Icon className="w-10 h-10 text-[#D4AF37]/80 mb-4" aria-hidden />
                <h3 className="font-semibold text-white mb-1">{titleFa}</h3>
                <p className="text-white/60 text-sm">{titleEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28 px-4 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-semibold mb-4 text-center">
            فرایند کار
          </p>
          <h2 className="font-[var(--font-playfair)] text-2xl md:text-4xl font-light text-[#0C0C0C] text-center mb-14 tracking-tight">
            مراحل رشد کسب‌وکار شما
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {PROCESS.map(({ step, titleFa, descFa }) => (
              <div key={step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0C0C0C] text-[#D4AF37] font-bold text-lg mb-4">
                  {step}
                </div>
                <h3 className="font-[var(--font-playfair)] text-xl font-light text-[#0C0C0C] mb-2">
                  {titleFa}
                </h3>
                <p className="text-[#0C0C0C]/70 text-sm mb-1">{title}</p>
                <p className="text-[#0C0C0C]/80 text-sm leading-relaxed">{descFa}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28 px-4 bg-[#0C0C0C] text-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-semibold mb-4 text-center">
            تیم ما
          </p>
          <h2 className="font-[var(--font-playfair)] text-2xl md:text-4xl font-light text-center mb-14 tracking-tight">
            تیم متخصص ما همیشه آماده کمک به شماست
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map(({ name, role, roleFa }) => (
              <div
                key={name}
                className="p-6 rounded-xl bg-white/5 border border-white/10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#D4AF37]/80" aria-hidden />
                </div>
                <h3 className="font-semibold text-white">{name}</h3>
                <p className="text-[#D4AF37]/90 text-sm mt-1">{roleFa}</p>
                <p className="text-white/60 text-xs mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 md:py-28 px-4 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#D4AF37] tracking-[0.2em] text-xs uppercase font-semibold mb-4 text-center">
            تماس با ما
          </p>
          <h2 className="font-[var(--font-playfair)] text-2xl md:text-4xl font-light text-[#0C0C0C] text-center mb-12 tracking-tight">
            می‌توانید در ساعات اداری به دفتر ما مراجعه کنید
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <MapPin className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" aria-hidden />
              <h3 className="font-semibold text-[#0C0C0C] mb-1">آدرس</h3>
              <p className="text-[#0C0C0C]/80 text-sm">مزار شریف، بازار مظفر</p>
            </div>
            <div>
              <Mail className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" aria-hidden />
              <h3 className="font-semibold text-[#0C0C0C] mb-1">ایمیل</h3>
              <a
                href="mailto:info@galaxytechology.com"
                className="text-[#0C0C0C]/80 text-sm hover:text-[#D4AF37] transition-colors"
              >
                info@galaxytechology.com
              </a>
            </div>
            <div>
              <Phone className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" aria-hidden />
              <h3 className="font-semibold text-[#0C0C0C] mb-1">تلفن</h3>
              <a
                href="tel:+93797548234"
                className="text-[#0C0C0C]/80 text-sm hover:text-[#D4AF37] transition-colors"
              >
                +93 797 548 234
              </a>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-[#0C0C0C]/70 text-sm">
            <Clock className="w-4 h-4" aria-hidden />
            <span>ساعات کاری: شنبه تا پنج‌شنبه ۰۸:۰۰ – ۱۷:۰۰</span>
          </div>
          <p className="mt-8 text-center">
            <Link
              href="https://www.galaxytechology.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] font-semibold hover:underline"
            >
              galaxytechology.com
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
