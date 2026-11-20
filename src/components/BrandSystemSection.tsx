import React from 'react';
import { BRAND, BRAND_PIGMENTS, PLACEMENT_PRINCIPLES } from '../data/brand';
import { StressEmblem } from './StressEmblem';

export const BrandSystemSection: React.FC = () => {
  return (
    <section id="brand-system" className="border-b border-[#1A1512]/10 py-14 lg:py-20 bg-[#EFE9DC]/60">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 space-y-12">
        {/* New Brand Emblem Reveal (Derived from Look 57 Woven Neck Label) */}
        <div className="bg-[#FAF7F2] border border-[#1A1512]/12 rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6 border-b lg:border-b-0 lg:border-r border-[#1A1512]/10">
            <div className="space-y-3">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#1F3D2B]">
                House Cipher · Derived from Look 57 Collar Label
              </p>
              <h2 className="font-brand-serif text-3xl text-[#1A1512] text-balance">
                The Fault-Line Seal: silent geometry under pressure.
              </h2>
              <p className="text-sm leading-relaxed text-[#4A433B]">
                Born inside the Forest Pine neck tab of the Moss Olive Buckled Tank (Look 57), this
                unclosed angular mark acts as an enigmatic house cipher. Nothing explains itself on
                the street: the mark sits woven inside every garment collar and waistband,
                screen-printed in atmospheric xerox grain on dark knits, jacquard-knitted on crew
                socks, and stamped across contoured boxer briefs.
              </p>
            </div>

            {/* Symbolic Meaning Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-[#1A1512]/10">
              <div className="p-3 bg-[#F5F0E6] border border-[#1A1512]/10 rounded">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#1F3D2B]">
                  01 · Fractured Ascent
                </div>
                <div className="mt-1 text-xs font-semibold text-[#1A1512]">
                  Tension Bent, Not Broken
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-[#5A5248]">
                  An unbroken spire climbs to a narrow apex and deflects twice like tectonic stone—mapping how pressure redirects through structure rather than shattering.
                </p>
              </div>
              <div className="p-3 bg-[#F5F0E6] border border-[#1A1512]/10 rounded">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#1F3D2B]">
                  02 · Detached Threshold
                </div>
                <div className="mt-1 text-xs font-semibold text-[#1A1512]">
                  The Unspoken Interval
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-[#5A5248]">
                  The isolated horizontal baseline refuses to enclose a standard monogram—a deliberate silence evoking the quiet, unreadable posture of the house.
                </p>
              </div>
            </div>

            {/* Live Woven Label & Lockup Specimen */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#1A1512]/10">
              <div className="w-16 h-16 rounded bg-[#1F3D2B] flex items-center justify-center border border-[#1A1512]/15 shadow-xs">
                <StressEmblem className="w-8 h-10 text-[#F5F0E6]" />
              </div>
              <div className="w-16 h-16 rounded bg-[#1A1512] flex items-center justify-center border border-[#1A1512]/25">
                <StressEmblem className="w-8 h-10 text-[#A98B5E]" />
              </div>
              <div className="w-16 h-16 rounded bg-[#F5F0E6] flex items-center justify-center border border-[#1A1512]/15">
                <StressEmblem className="w-8 h-10 text-[#1F3D2B]" />
              </div>
              <div className="text-[11px] font-mono text-[#5A5248] space-y-0.5">
                <div className="text-[#1A1512] font-semibold">SPEC: LBL-01 SEAL · ALL 70 SKUs</div>
                <div>All neck/waist labels · Graphic chest plates</div>
                <div>Jacquard socks (#43, #56) · Boxers (#51, #52)</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#F5F0E6] flex items-center justify-center">
            <img
              src={BRAND.emblemLogoAsset}
              alt="stress Fault-Line Seal Emblem Logo Sheet derived from Look 57 woven collar label"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5A5248]">
              Identity &amp; Dye Architecture
            </p>
            <h2 className="mt-2 font-brand-serif text-3xl sm:text-4xl text-[#1A1512] text-balance">
              Six letters, six mineral pigments.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#4A433B] max-w-[48ch]">
              Every silhouette in the stress capsule draws its dye bath and thread finish directly
              from the six color stops of our Bodoni wordmark—turning disparate materials into one
              disciplined urban wardrobe.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {BRAND_PIGMENTS.map((pigment, idx) => (
              <div
                key={pigment.id}
                className="bg-[#FAF7F2] border border-[#1A1512]/10 rounded-lg p-4 flex flex-col justify-between gap-4"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-8 h-8 rounded-md border border-[#1A1512]/10"
                    style={{ backgroundColor: pigment.hex }}
                    aria-hidden="true"
                  />
                  <span className="font-brand-serif text-2xl lowercase text-[#1A1512]">
                    {pigment.letter}
                    <span className="text-[10px] font-mono text-[#7A7065] ml-1 tabular-nums">
                      0{idx + 1}
                    </span>
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1A1512]">{pigment.name}</div>
                  <div className="text-[11px] font-mono text-[#5A5248] mt-0.5 tabular-nums">
                    {pigment.hex}
                  </div>
                  <div className="text-xs text-[#5A5248] mt-1.5 leading-snug">
                    {pigment.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Placement Rules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-[#1A1512]/10">
          {PLACEMENT_PRINCIPLES.map((item) => (
            <div key={item.index} className="space-y-2">
              <div className="text-xs font-mono text-[#1F3D2B] tabular-nums">
                {item.index}. {item.title}
              </div>
              <p className="text-sm leading-relaxed text-[#4A433B]">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
