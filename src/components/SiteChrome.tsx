import Link from 'next/link';
import { Building2, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV = [
  { href: '/#services', label: 'Services' },
  { href: '/#projects', label: 'Projects' },
  { href: '/team', label: 'Our Team' },
  { href: '/#why', label: 'Why Us' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-secondary/90 text-white backdrop-blur-md">
      <div className="container flex h-[68px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand-gold to-brand-amber font-black text-secondary">
            LP
          </span>
          <span className="hidden sm:inline">Levelplay Constructions</span>
        </Link>
        <nav className="flex items-center gap-6">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="hidden text-sm font-semibold text-brand-mist transition-colors hover:text-white md:inline"
            >
              {n.label}
            </Link>
          ))}
          <Button asChild variant="light" size="sm">
            <Link href="/login">Client Login</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-secondary py-12 text-brand-mist">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-2 font-display text-lg font-extrabold text-white">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand-gold to-brand-amber font-black text-secondary">
                LP
              </span>
              <span>Levelplay Constructions</span>
            </div>
            <p className="max-w-xs text-sm text-brand-steel">
              Turnkey construction and interiors across Bangalore and Karnataka.
              Quality builds, transparent payments, and a portal that keeps you in
              the loop at every stage.
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-display text-base font-bold text-white">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#services" className="hover:text-white">Services</Link></li>
              <li><Link href="/#projects" className="hover:text-white">Projects</Link></li>
              <li><Link href="/team" className="hover:text-white">Our Team</Link></li>
              <li><Link href="/contact" className="hover:text-white">Get a Quote</Link></li>
              <li><Link href="/login" className="hover:text-white">Client Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-display text-base font-bold text-white">Reach Us</h3>
            <ul className="space-y-2 text-sm text-brand-steel">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>#43, 10th Cross, 6th Main, Mahalakshmi Layout, Bangalore 560086</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" /> levelplayconstructions@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Building2 className="h-4 w-4 shrink-0" /> Residential · Commercial · Interiors
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-5 text-sm text-brand-steel">
          <span>© {new Date().getFullYear()} Levelplay Constructions. Demo build.</span>
          <span>Bengaluru · Mysuru · Tumakuru · Davanagere · Shivamogga</span>
        </div>
      </div>
    </footer>
  );
}
