'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
}

export function Logo({
  variant = 'full',
  className,
}: LogoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fallbackText = (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-md">
        <span className="text-sm font-bold text-white">BH</span>
      </div>

      <span className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">
        Brizer<span className="text-brand-500">Hero</span>
      </span>
    </div>
  );

  if (!mounted) {
    return fallbackText;
  }

  return (
    <div className={cn('flex items-center', className)}>
      {variant === 'full' ? (
        <Image
          src="/logo.svg"
          alt="BrizerHero"
          width={700}
          height={175}
          className="h-12 w-auto object-contain"
          priority
        />
      ) : (
        <Image
          src="/logo-icon.svg"
          alt="BrizerHero"
          width={48}
          height={48}
          className="h-10 w-10 object-contain"
          priority
        />
      )}
    </div>
  );
}