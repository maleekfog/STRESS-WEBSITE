import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Garment, GarmentAngle } from '../types/garment';
import { RedesignedGarment } from './RedesignedGarment';

interface HeroSectionProps {
  spotlightGarments: Garment[];
  onInspectGarment: (garment: Garment) => void;
  onOpenOrderLookup: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  spotlightGarments,
  onInspectGarment,
  onOpenOrderLookup,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [stageMode, setStageMode] = useState<'model' | 'garment'>('model');
  const [activeAngle, setActiveAngle] = useState<GarmentAngle>('front');

  const activeGarment = spotlightGarments[activeIdx] ?? spotlightGarments[0];

  return (
    <section id="top" className="border-b border-[#1A1512]/10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Luxury Editorial Copy & Allocation Callout */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-10 py-2">
            <div className="space-y-6">
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#1F3D2B]">
                AW26 Pre-Order Flagship · Batch 01 Open
              </p>

              <h1 className="font-brand-serif text-[clamp(2.75rem,4.6vw,4.35rem)] leading-[1.02] tracking-[-0.02em] text-[#1A1512] text-balance">
                Composed Under Pressure.
              </h1>

              <p className="text-[15px] sm:text-base leading-[1.7] text-[#4A433B] max-w-[44ch]">
                Numbered outerwear, 14oz selvedge workwear, and mineral-dyed essentials sealed with
                the quiet geometry of the Fault-Line cipher. Crafted strictly to order in limited
                run allocations.
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-2">
                <a
                  href="#shop"
                  className="inline-flex items-center gap-2.5 h-11 px-7 bg-[#1F3D2B] text-[#F5F0E6] text-xs font-medium uppercase tracking-[0.1em] rounded-sm hover:bg-[#162D1F] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Shop AW26 Pre-Order</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>

                <a
                  href="#lookbook"
                  className="text-xs font-medium uppercase tracking-[0.08em] text-[#1A1512] hover:text-[#1F3D2B] underline underline-offset-4 transition-colors whitespace-nowrap"
                >
                  Explore Lookbook
                </a>
              </div>
            </div>

            {/* Quiet Unboxed Allocation Guarantees */}
            <div className="grid grid-cols-3 gap-6 pt-7 border-t border-[#1A1512]/10">
              <div>
                <div className="font-brand-serif text-xl sm:text-2xl text-[#1A1512] tabular-nums">
                  Batch 01
                </div>
                <div className="mt-1 text-[11px] text-[#5A5248] leading-snug">
                  70 Numbered Pieces
                </div>
              </div>
              <div>
                <div className="font-brand-serif text-xl sm:text-2xl text-[#1A1512] tabular-nums">
                  Dec 2026
                </div>
                <div className="mt-1 text-[11px] text-[#5A5248] leading-snug">
                  Est. Dispatch (4–6 Wks)
                </div>
              </div>
              <div>
                <div className="font-brand-serif text-xl sm:text-2xl text-[#1A1512] tabular-nums">
                  $1,000+
                </div>
                <div className="mt-1 text-[11px] text-[#5A5248] leading-snug">
                  <button
                    type="button"
                    onClick={onOpenOrderLookup}
                    className="hover:text-[#1A1512] underline underline-offset-2 text-left cursor-pointer"
                  >
                    Private Insured Courier
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Full-Bleed Architectural Gallery Stage */}
          {activeGarment && (
            <div className="lg:col-span-7 flex flex-col justify-between bg-[#FAF7F2] border border-[#1A1512]/10">
              <div
                className={`relative aspect-[4/5] lg:aspect-auto lg:h-[560px] w-full overflow-hidden bg-[#EFE9DC] ${
                  stageMode === 'garment' ? 'cursor-ew-resize' : 'cursor-pointer'
                }`}
                onMouseMove={(e) => {
                  if (stageMode !== 'garment') return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = (e.clientX - rect.left) / Math.max(1, rect.width);
                  if (ratio < 0.25) setActiveAngle('front');
                  else if (ratio < 0.5) setActiveAngle('back');
                  else if (ratio < 0.75) setActiveAngle('left');
                  else setActiveAngle('right');
                }}
              >
                <button
                  type="button"
                  onClick={() => onInspectGarment(activeGarment)}
                  className="w-full h-full block text-left focus-visible:outline-none"
                  aria-label={`Pre-order ${activeGarment.name} — $${activeGarment.price}`}
                >
                  <RedesignedGarment
                    garment={activeGarment}
                    angle={activeAngle}
                    viewType={stageMode}
                  />
                </button>

                {/* Minimal Editorial View Switcher */}
                <div className="absolute top-4 right-4 inline-flex items-center bg-[#F5F0E6]/90 backdrop-blur-xs border border-[#1A1512]/12 rounded-sm p-0.5 z-10">
                  <button
                    type="button"
                    onClick={() => {
                      setStageMode('model');
                      setActiveAngle('front');
                    }}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-xs transition-colors cursor-pointer ${
                      stageMode === 'model'
                        ? 'bg-[#1A1512] text-[#F5F0E6]'
                        : 'text-[#5A5248] hover:text-[#1A1512]'
                    }`}
                  >
                    On Model
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageMode('garment')}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-xs transition-colors cursor-pointer ${
                      stageMode === 'garment'
                        ? 'bg-[#1A1512] text-[#F5F0E6]'
                        : 'text-[#5A5248] hover:text-[#1A1512]'
                    }`}
                  >
                    360° Piece
                  </button>
                </div>

                {stageMode === 'garment' && (
                  <div className="pointer-events-none absolute bottom-3 left-4 px-2.5 py-1 bg-[#F5F0E6]/90 border border-[#1A1512]/12 text-[10px] font-mono uppercase tracking-wider text-[#1A1512]">
                    {activeAngle} · Move across to rotate
                  </div>
                )}
              </div>

              {/* Clean Gallery Caption & Look Switcher */}
              <div className="px-5 py-4 border-t border-[#1A1512]/10 bg-[#FAF7F2] flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => onInspectGarment(activeGarment)}
                    className="group text-left cursor-pointer"
                  >
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#5A5248] tabular-nums">
                      Look {activeGarment.number} · {activeGarment.category} ·{' '}
                      <span className="text-[#1A1512] font-semibold">
                        ${activeGarment.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-0.5 font-brand-serif text-lg text-[#1A1512] group-hover:text-[#1F3D2B] transition-colors truncate">
                      {activeGarment.name} — Reserve Piece →
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {spotlightGarments.map((g, i) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setActiveIdx(i);
                        setActiveAngle('front');
                      }}
                      aria-label={`View Look ${g.number}: ${g.name}`}
                      className={`w-9 h-9 text-[11px] font-mono border transition-colors cursor-pointer tabular-nums ${
                        i === activeIdx
                          ? 'bg-[#1A1512] text-[#F5F0E6] border-[#1A1512]'
                          : 'bg-transparent text-[#5A5248] border-[#1A1512]/15 hover:border-[#1A1512]/40'
                      }`}
                    >
                      0{i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
