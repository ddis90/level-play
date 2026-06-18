// FIXED Flipping Card Component - NO REVERSED TEXT
'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export function FlipCard({ front, back, className = '' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={`perspective-1000 ${className}`}>
      <motion.div
        className="relative w-full h-full preserve-3d cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 120,
          damping: 20
        }}
      >
        {/* Front - normal orientation */}
        <div className="absolute inset-0 backface-hidden">
          {front}
        </div>

        {/* Back - PRE-FLIPPED so text reads correctly */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}

// ADVANCED Glassmorphism Levels
type GlassIntensity = 'subtle' | 'light' | 'medium' | 'strong' | 'frosted';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  intensity?: GlassIntensity;
  glow?: boolean;
}

export function GlassCard({
  children,
  className = '',
  intensity = 'medium',
  glow = false,
  ...props
}: GlassCardProps) {
  const intensityStyles: Record<GlassIntensity, string> = {
    subtle: 'bg-white/5 dark:bg-white/5 backdrop-blur-sm border-white/10',
    light: 'bg-white/8 dark:bg-white/8 backdrop-blur-sm border-white/15',
    medium: 'bg-white/10 dark:bg-white/10 backdrop-blur-md border-white/20',
    strong: 'bg-white/15 dark:bg-white/15 backdrop-blur-lg border-white/25',
    frosted: 'bg-white/20 dark:bg-white/20 backdrop-blur-xl border-white/30 shadow-2xl',
  };

  return (
    <motion.div
      className={`
        relative rounded-2xl border overflow-hidden
        ${intensityStyles[intensity]}
        ${glow ? 'shadow-[0_0_30px_rgba(251,191,36,0.15)]' : ''}
        ${className}
      `}
      whileHover={glow ? {
        boxShadow: '0 0 40px rgba(251,191,36,0.25)',
        scale: 1.02
      } : undefined}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none" />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// 3D Depth Card with Parallax
interface Depth3DCardProps {
  children: ReactNode;
  className?: string;
}

export function Depth3DCard({ children, className = '' }: Depth3DCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotX = ((y - centerY) / centerY) * -10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className={`perspective-1000 ${className}`}>
      <motion.div
        className="relative preserve-3d"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {children}

        {/* 3D shadow layer */}
        <div
          className="absolute inset-0 bg-black/40 blur-xl rounded-2xl -z-10"
          style={{ transform: 'translateZ(-50px)' }}
        />
      </motion.div>
    </div>
  );
}

// Floating Construction Element
interface FloatingElementProps {
  delay?: number;
  shape: 'triangle' | 'square' | 'hexagon' | 'beam';
  size?: number;
}

export function FloatingElement({
  delay = 0,
  shape = 'triangle',
  size = 100
}: FloatingElementProps) {
  const shapes = {
    triangle: <polygon points="50,10 90,90 10,90" fill="currentColor" opacity="0.1" />,
    square: <rect x="20" y="20" width="60" height="60" fill="currentColor" opacity="0.1" />,
    hexagon: <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="currentColor" opacity="0.1" />,
    beam: <rect x="10" y="45" width="80" height="10" fill="currentColor" opacity="0.1" />,
  };

  return (
    <motion.div
      className="absolute"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, rotate: 0 }}
      animate={{
        opacity: [0.1, 0.2, 0.1],
        rotate: [0, 360],
        y: [0, -40, 0],
        x: [0, 20, 0],
      }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 100 100" className="text-amber-500">
        {shapes[shape]}
      </svg>
    </motion.div>
  );
}

// Advanced Connect Section with Interactive Elements
export function ConnectSection() {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated construction grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAgTSAwIDIwIEwgMCAzMCBNIDAgNDAgTCAwIDUwIE0gMCA2MCBMIDQ2IDYwIE0gNjAgNjAgTCA2MCA0NiBNIDYwIDMwIEwgNjAgMCBNIDIwIDAgTCAzMCAwIE0gNDAgMCBMIDUwIDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZiYjYzNiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />
      </div>

      {/* Floating elements */}
      <FloatingElement shape="triangle" delay={0} size={120} />
      <FloatingElement shape="hexagon" delay={4} size={100} />
      <FloatingElement shape="beam" delay={8} size={140} />

      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-5xl md:text-6xl font-black text-white mb-6">
              Let's Build Your
              <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Dream Project
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get expert consultation and transparent quotation within 24 hours
            </p>
          </motion.div>

          {/* Contact Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <GlassCard intensity="strong" glow className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Quick Inquiry</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    placeholder="Rajesh Kumar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project Type
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all">
                    <option>Individual Home</option>
                    <option>Villa</option>
                    <option>Apartment</option>
                    <option>Commercial</option>
                    <option>Interior Design</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02]"
                >
                  Get Free Consultation
                </button>
              </form>
            </GlassCard>

            {/* Contact Info */}
            <div className="space-y-6">
              {[
                {
                  icon: '📞',
                  title: 'Call Us',
                  value: '+91 98765 43210',
                  subtitle: 'Mon-Sat, 9 AM - 7 PM',
                },
                {
                  icon: '💬',
                  title: 'WhatsApp',
                  value: 'Instant Response',
                  subtitle: 'Chat with our experts',
                },
                {
                  icon: '📧',
                  title: 'Email',
                  value: 'hello@levelplay.com',
                  subtitle: 'We reply within 2 hours',
                },
                {
                  icon: '📍',
                  title: 'Visit Office',
                  value: 'Bengaluru, Karnataka',
                  subtitle: 'Schedule a site visit',
                },
              ].map((item, i) => (
                <Depth3DCard key={i}>
                  <GlassCard
                    intensity="medium"
                    className="p-6 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{item.icon}</div>
                      <div>
                        <div className="text-sm text-slate-400">{item.title}</div>
                        <div className="text-lg font-bold text-white">{item.value}</div>
                        <div className="text-xs text-slate-500">{item.subtitle}</div>
                      </div>
                    </div>
                  </GlassCard>
                </Depth3DCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
