'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Mail, MapPin } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const NAV = [
  { href: '/#services', label: 'Services', section: 'services' },
  { href: '/#projects', label: 'Projects', section: 'projects' },
  { href: '/team', label: 'Our Team' },
  { href: '/#why', label: 'Why Us', section: 'why' },
  { href: '/contact', label: 'Contact' },
];

function NavLink({ item }: { item: typeof NAV[0] }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // If it's a hash link and we're on homepage, use smooth scroll
  if (item.section && isHome) {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      const element = document.getElementById(item.section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    return (
      <a
        href={`#${item.section}`}
        onClick={handleClick}
        className="hidden text-sm font-semibold text-slate-600 dark:text-slate-400 transition-colors hover:text-cyan-500 dark:hover:text-cyan-400 md:inline relative group"
      >
        {item.label}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-500 group-hover:w-full transition-all duration-300"></span>
      </a>
    );
  }

  // Otherwise use Next.js Link for proper navigation
  return (
    <Link
      href={item.href}
      className="hidden text-sm font-semibold text-slate-600 dark:text-slate-400 transition-colors hover:text-cyan-500 dark:hover:text-cyan-400 md:inline relative group"
    >
      {item.label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-500 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 text-slate-900 dark:text-white backdrop-blur-xl transition-colors">
      <div className="container flex h-[72px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-display text-xl font-bold group">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 font-black text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            LP
          </span>
          <span className="hidden sm:inline group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">Levelplay</span>
        </Link>
        <nav className="flex items-center gap-8">
          {NAV.map((n) => (
            <NavLink key={n.href} item={n} />
          ))}
          <ThemeToggle />
          <Link
            href="/login"
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-sm rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105"
          >
            Client Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 py-16 text-slate-400 border-t border-slate-800">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-3 font-display text-xl font-bold text-white">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 font-black text-white shadow-lg shadow-cyan-500/20">
                LP
              </span>
              <span>Levelplay</span>
            </div>
            <p className="max-w-sm text-sm text-slate-400 leading-relaxed">
              Turnkey construction and interiors across Bangalore and Karnataka.
              Quality builds, transparent payments, and a portal that keeps you in
              the loop at every stage.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-display text-lg font-bold text-white">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#services" className="hover:text-cyan-400 transition-colors">Services</Link></li>
              <li><Link href="/#projects" className="hover:text-cyan-400 transition-colors">Projects</Link></li>
              <li><Link href="/team" className="hover:text-cyan-400 transition-colors">Our Team</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">Get a Quote</Link></li>
              <li><Link href="/login" className="hover:text-cyan-400 transition-colors">Client Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-display text-lg font-bold text-white">Reach Us</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                <span>#43, 10th Cross, 6th Main, Mahalakshmi Layout, Bangalore 560086</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-cyan-400" />
                <span className="hover:text-cyan-400 transition-colors">levelplayconstructions@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Building2 className="h-5 w-5 shrink-0 text-cyan-400" />
                <span>Residential · Commercial · Interiors</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Levelplay Constructions. Demo build.</span>
          <span>Bengaluru · Mysuru · Tumakuru · Davanagere · Shivamogga</span>
        </div>
      </div>
    </footer>
  );
}
