import './globals.css';
import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const sora = Sora({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  title: 'Levelplay Constructions — Build with Confidence',
  description:
    'Turnkey home, apartment, commercial and interior construction across Bangalore and Karnataka. Track your project, payments and progress in one place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const env = process.env.APP_ENV || 'dev';
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {env !== 'prd' && (
          <div className="env-banner">
            {env.toUpperCase()} ENVIRONMENT — Proof of Concept demo build
          </div>
        )}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
