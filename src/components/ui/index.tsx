'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
}

export function GlassCard({ children, className = '', intensity = 'medium', ...props }: GlassCardProps) {
  const intensityClasses = {
    light: 'bg-white/5 dark:bg-white/5 backdrop-blur-sm',
    medium: 'bg-white/10 dark:bg-white/10 backdrop-blur-md',
    strong: 'bg-white/20 dark:bg-white/15 backdrop-blur-xl',
  };

  return (
    <motion.div
      className={`${intensityClasses[intensity]} border border-white/20 dark:border-white/10 rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  href?: string;
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  href
}: AnimatedButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-400 hover:to-teal-400 shadow-lg shadow-cyan-500/20',
    secondary: 'border-2 border-slate-700 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-cyan-500 hover:text-cyan-500',
    ghost: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700',
  };

  const sizes = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  const Component = href ? motion.a : motion.button;
  const extraProps = href ? { href } : { onClick, disabled };

  return (
    <Component
      className={`relative font-bold rounded-xl transition-all duration-300 overflow-hidden ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      {...extraProps}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </Component>
  );
}

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

        {/* Back - PRE-FLIPPED so text reads correctly when parent rotates */}
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

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, className = '', showLabel = true }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600 dark:text-slate-400">Progress</span>
          <span className="text-cyan-500 dark:text-cyan-400 font-bold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'default';
  pulse?: boolean;
}

export function Badge({ children, variant = 'default', pulse = false }: BadgeProps) {
  const variants = {
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    default: 'bg-slate-500/20 text-slate-400 dark:text-slate-300 border-slate-500/30',
  };

  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${variants[variant]}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      {pulse && (
        <motion.span
          className="w-2 h-2 rounded-full bg-current"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {children}
    </motion.div>
  );
}

export function Skeleton({ className = '', count = 1 }: { className?: string; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`}
        />
      ))}
    </>
  );
}
