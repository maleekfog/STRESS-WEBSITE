import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { BRAND } from '../data/brand';
import { StressEmblem } from './StressEmblem';
import { StressWordmark } from './StressWordmark';

interface FooterProps {
  onOpenOrderLookup: () => void;
  onOpenTechPack: () => void;
  onOpenFounderArchive: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOrderLookup,
  onOpenTechPack,
  onOpenFounderArchive,
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'joined' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'submitting') return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('joined');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-[#F5F0E6] pt-14 pb-10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1A1512]/10">
          {/* Column 1: House Mark */}
          <div className="md:col-span-4 space-y-3">
            <div className="inline-flex items-center gap-2.5">
              <StressEmblem className="w-4 h-5 text-[#1F3D2B]" />
              <StressWordmark sizeClass="text-2xl" />
            </div>
            <p className="text-xs text-[#5A5248] leading-relaxed max-w-[34ch]">
              {BRAND.slogan} Every AW26 piece is cut, mineral-dyed, and distressed strictly to
              pre-order allocation.
            </p>
          </div>

          {/* Column 2: Client Services */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-2.5">
              <div className="font-mono uppercase tracking-[0.12em] text-[#1A1512] text-[10px]">
                Flagship
              </div>
              <div className="flex flex-col gap-2 text-[#5A5248]">
                <a href="#shop" className="hover:text-[#1A1512] transition-colors">
                  AW26 Pre-Order
                </a>
                <a href="#lookbook" className="hover:text-[#1A1512] transition-colors">
                  Lookbook
                </a>
                <a href="#house" className="hover:text-[#1A1512] transition-colors">
                  The House &amp; Seal
                </a>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="font-mono uppercase tracking-[0.12em] text-[#1A1512] text-[10px]">
                Pre-Order Care
              </div>
              <div className="flex flex-col gap-2 text-[#5A5248]">
                <button
                  type="button"
                  onClick={onOpenOrderLookup}
                  className="text-left hover:text-[#1A1512] transition-colors cursor-pointer"
                >
                  Track Pre-Order
                </button>
                <span>Est. Dispatch Dec 2026</span>
                <span>Complimentary Courier $1,000+</span>
              </div>
            </div>
          </div>

          {/* Column 3: Private Allocation List */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-mono uppercase tracking-[0.12em] text-[#1A1512] text-[10px]">
              Private Drop Registry
            </div>
            <p className="text-xs text-[#5A5248]">
              Receive Batch 02 allocation windows and studio dispatches.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== 'idle') setStatus('idle');
                }}
                placeholder="email@domain.com"
                aria-label="Email for private allocation drops"
                className="flex-1 h-10 px-3 text-xs bg-[#FAF7F2] border border-[#1A1512]/15 focus:outline-none focus:border-[#1F3D2B]"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="h-10 px-5 bg-[#1A1512] text-[#F5F0E6] text-[11px] font-medium uppercase tracking-[0.1em] hover:bg-[#1F3D2B] transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5"
              >
                {status === 'joined' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Registered</span>
                  </>
                ) : (
                  <span>Join</span>
                )}
              </button>
            </form>
            {status === 'error' && (
              <p className="text-[11px] text-[#6B1F16]">Enter a valid email address.</p>
            )}
          </div>
        </div>

        {/* Discreet Bottom Bar + Internal Studio Portal Links */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#7A7065]">
          <span>© 2026 stress · Composed Under Pressure.</span>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={onOpenFounderArchive}
              className="hover:text-[#1A1512] transition-colors cursor-pointer"
            >
              Founder Studio Archive
            </button>
            <button
              type="button"
              onClick={onOpenTechPack}
              className="hover:text-[#1A1512] transition-colors cursor-pointer"
            >
              Manufacturer Production Dossier
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
