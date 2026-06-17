import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { OnboardingForm } from '@/components/OnboardingForm';

export const metadata = { title: 'Start Your Project — Levelplay Constructions' };

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <section style={{ background: 'var(--white)', paddingTop: '3.5rem' }}>
        <div className="container grid grid-2" style={{ alignItems: 'start', gap: '3rem' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--amber-strong)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.82rem' }}>
              Get Started
            </span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Tell us about your project</h1>
            <p className="muted" style={{ fontSize: '1.05rem' }}>
              Share a few details and our team will reach out for a consultation.
              Once you come on board, you get portal access to track drawings,
              payments and on-site progress in real time.
            </p>
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem' }}>Reach us directly</h3>
              <p className="muted" style={{ margin: 0 }}>
                #43, 10th Cross, 6th Main, Mahalakshmi Layout, Bangalore 560086<br />
                levelplayconstructions@gmail.com
              </p>
            </div>
          </div>
          <OnboardingForm />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
