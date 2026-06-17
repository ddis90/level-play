import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';

const SERVICES = [
  { icon: '🏠', title: 'Home Construction', body: 'Independent houses and duplex villas built to your plan, from foundation to finishing.' },
  { icon: '🏢', title: 'Apartment Construction', body: 'Multi-unit residential blocks delivered with structural integrity and on-time milestones.' },
  { icon: '🏬', title: 'Commercial Construction', body: 'Retail, office and mixed-use spaces designed for footfall, function and durability.' },
  { icon: '🛋️', title: 'Interior Design', body: 'Turnkey interiors — modular kitchens, wardrobes, false ceilings and bespoke finishes.' },
];

const PROJECTS = [
  { name: 'Sharma Residence — Duplex Villa', city: 'RR Nagar, Bangalore', status: 'In Progress', badge: 'badge-progress' },
  { name: 'Greenfield Apartments', city: 'Mysuru', status: 'Design Phase', badge: 'badge-design' },
  { name: 'Sai Commercial Complex', city: 'Davanagere', status: 'Completed', badge: 'badge-done' },
  { name: 'Lakeview Interiors', city: 'Shivamogga', status: 'Completed', badge: 'badge-done' },
];

const STATS = [
  { num: '120+', label: 'Projects Delivered' },
  { num: '8', label: 'Cities Served' },
  { num: '15+', label: 'Years of Experience' },
  { num: '100%', label: 'Transparent Billing' },
];

const WHY = [
  { icon: '📐', title: 'Turnkey Delivery', body: 'One accountable team from design drawings to handover — no coordination headaches.' },
  { icon: '💳', title: 'Transparent Payments', body: 'Milestone-based payment structure with a full audit trail you can see anytime.' },
  { icon: '📲', title: 'Live Project Portal', body: 'Track progress photos, drawings, deliveries and approvals from your phone or laptop.' },
  { icon: '🌱', title: 'Quality & Sustainability', body: 'Certified materials and eco-conscious methods on every build.' },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <div className="hero">
        <div className="container hero-inner">
          <span className="eyebrow">Bangalore · Karnataka</span>
          <h1>Build with confidence, track every brick.</h1>
          <p className="lede">
            Levelplay Constructions delivers turnkey homes, apartments, commercial
            spaces and interiors — paired with a portal that keeps you in control of
            drawings, payments and progress at every stage.
          </p>
          <div className="hero-cta">
            <Link href="/contact" className="btn btn-primary">Start Your Project →</Link>
            <Link href="/#projects" className="btn btn-ghost">View Our Work</Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container grid grid-4">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <div className="num">{s.num}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What We Build</span>
            <h2>End-to-end construction services</h2>
            <p className="muted">From a single home to a commercial complex, we manage design, build and interiors under one roof.</p>
          </div>
          <div className="grid grid-4">
            {SERVICES.map((s) => (
              <div className="card" key={s.title}>
                <div className="icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p className="muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our Work</span>
            <h2>Projects across Karnataka</h2>
            <p className="muted">A snapshot of ongoing and completed builds. Clients follow every one of these live in the portal.</p>
          </div>
          <div className="grid grid-4">
            {PROJECTS.map((p) => (
              <div className="card project-card" key={p.name}>
                <div className="thumb">LEVELPLAY</div>
                <div className="body">
                  <span className={`badge ${p.badge}`}>{p.status}</span>
                  <h3 style={{ marginTop: '0.7rem', fontSize: '1.05rem' }}>{p.name}</h3>
                  <p className="muted" style={{ margin: 0 }}>{p.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why Levelplay</span>
            <h2>A builder and a platform in one</h2>
          </div>
          <div className="grid grid-4">
            {WHY.map((w) => (
              <div className="card" key={w.title}>
                <div className="icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p className="muted">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--navy)', color: 'var(--white)', textAlign: 'center' }}>
        <div className="container">
          <h2>Ready to start your build?</h2>
          <p className="muted" style={{ color: 'var(--mist)', maxWidth: 520, margin: '0 auto 1.8rem' }}>
            Tell us about your plot and requirements. Our team will get back with a
            consultation and an estimate.
          </p>
          <Link href="/contact" className="btn btn-primary">Request a Consultation →</Link>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
