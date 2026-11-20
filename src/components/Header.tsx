import React, { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { StressEmblem } from './StressEmblem';
import { StressWordmark } from './StressWordmark';

interface HeaderProps {
  bagCount: number;
  onOpenBag: () => void;
  onOpenOrderLookup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  bagCount,
  onOpenBag,
  onOpenOrderLookup,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F5F0E6]/95 backdrop-blur-sm border-b border-[#1A1512]/10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Cipher + Wordmark */}
        <a
          href="#top"
          className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3D2B] rounded-sm"
        >
          <StressEmblem className="w-4 h-5 text-[#1F3D2B] shrink-0" />
          <StressWordmark sizeClass="text-[26px]" />
        </a>

        {/* Zone 2: 4 Concise Consumer Navigation Links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-[0.01em] text-[#5A5248]"
        >
          <a
            href="#shop"
            className="hover:text-[#1A1512] transition-colors whitespace-nowrap shrink-0"
          >
            Pre-Order
          </a>
          <a
            href="#lookbook"
            className="hover:text-[#1A1512] transition-colors whitespace-nowrap shrink-0"
          >
            Lookbook
          </a>
          <a
            href="#house"
            className="hover:text-[#1A1512] transition-colors whitespace-nowrap shrink-0"
          >
            The House
          </a>
          <button
            type="button"
            onClick={onOpenOrderLookup}
            className="hover:text-[#1A1512] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Track Order
          </button>
        </nav>

        {/* Zone 3: Primary Shopping Bag Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            className="md:hidden w-10 h-10 inline-flex items-center justify-center text-[#1A1512] border border-[#1A1512]/15 rounded-sm cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenBag}
            className="inline-flex items-center gap-2 h-10 px-4 bg-[#1F3D2B] text-[#F5F0E6] text-xs font-medium tracking-[0.03em] uppercase rounded-sm hover:bg-[#162D1F] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3D2B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F0E6]"
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="tabular-nums">Bag ({bagCount})</span>
          </button>
        </div>
      </div>

      {/* Minimal Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1A1512]/10 bg-[#FAF7F2] px-4 py-4 flex flex-col gap-3 text-sm font-medium text-[#1A1512]">
          <a
            href="#shop"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 border-b border-[#1A1512]/8"
          >
            AW26 Pre-Order
          </a>
          <a
            href="#lookbook"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 border-b border-[#1A1512]/8"
          >
            Lookbook
          </a>
          <a
            href="#house"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 border-b border-[#1A1512]/8"
          >
            The House
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrderLookup();
            }}
            className="py-1.5 text-left cursor-pointer text-[#1F3D2B]"
          >
            Track Pre-Order
          </button>
        </div>
      )}
    </header>
  );
};
