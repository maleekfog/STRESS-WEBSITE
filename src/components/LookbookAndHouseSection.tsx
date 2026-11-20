import React, { useMemo, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { BRAND, BRAND_PIGMENTS } from '../data/brand';
import { JOURNAL_ARTICLES } from '../data/journal';
import { Garment, JournalArticle } from '../types/garment';
import { StressEmblem } from './StressEmblem';

interface LookbookAndHouseSectionProps {
  garments: Garment[];
  onInspectGarment: (garment: Garment) => void;
}

const LOOKBOOK_IDS = [
  'stress-59',
  'stress-60',
  'stress-68',
  'stress-04',
  'stress-36',
  'stress-43',
];

export const LookbookAndHouseSection: React.FC<LookbookAndHouseSectionProps> = ({
  garments,
  onInspectGarment,
}) => {
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);

  const lookbookLooks = useMemo(
    () =>
      LOOKBOOK_IDS.map((id) => garments.find((g) => g.id === id)).filter(
        (g): g is Garment => Boolean(g),
      ),
    [garments],
  );

  const findGarment = (id: string) =>
    garments.find((g) => g.id === id) ?? garments[0];

  return (
    <>
      {/* SECTION A: Curated Architectural Lookbook */}
      <section id="lookbook" className="border-b border-[#1A1512]/10 py-16 lg:py-24 bg-[#FAF7F2]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#1A1512]/10">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#5A5248]">
                AW26 Campaign · Complete Uniforms
              </p>
              <h2 className="mt-2 font-brand-serif text-3xl sm:text-4xl text-[#1A1512] text-balance">
                Architectural Lookbook
              </h2>
            </div>
            <p className="text-xs leading-relaxed text-[#5A5248] max-w-[44ch]">
              Every silhouette worn across the campaign is drawn exclusively from our 70 AW26
              house-distressed pieces—paired head to toe for seamless allocation.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {lookbookLooks.map((look) => (
              <article key={look.id} className="group flex flex-col">
                <button
                  type="button"
                  onClick={() => onInspectGarment(look)}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFE9DC] border border-[#1A1512]/10 cursor-pointer text-left"
                >
                  <img
                    src={look.modelImage}
                    alt={`${look.name} editorial look`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </button>
                <div className="pt-3.5 flex items-baseline justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#5A5248]">
                      Look {look.number} · {look.category}
                    </div>
                    <h3 className="mt-0.5 text-[15px] font-medium text-[#1A1512] truncate">
                      <button
                        type="button"
                        onClick={() => onInspectGarment(look)}
                        className="hover:text-[#1F3D2B] transition-colors cursor-pointer text-left"
                      >
                        {look.name}
                      </button>
                    </h3>
                  </div>
                  <span className="text-sm font-mono text-[#1A1512] tabular-nums shrink-0">
                    ${look.price.toLocaleString()}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION B: The House, Fault-Line Seal & Distressing Ethos */}
      <section id="house" className="border-b border-[#1A1512]/10 py-16 lg:py-24 bg-[#EFE9DC]/55">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.16em] text-[#1F3D2B]">
                <StressEmblem className="w-4 h-5 text-[#1F3D2B]" />
                <span>The House · Fault-Line Cipher &amp; Atelier Distressing</span>
              </div>

              <h2 className="font-brand-serif text-3xl sm:text-4xl text-[#1A1512] text-balance leading-[1.08]">
                Silent geometry under pressure. Every piece leaves the studio distressed.
              </h2>

              <p className="text-[15px] leading-[1.7] text-[#4A433B] max-w-[52ch]">
                Originating inside the Forest Pine collar label of Look 57, the unclosed Fault-Line
                cipher anchors every stress silhouette without overt explanation. Every single piece
                in the AW26 collection—from horsehide coats and selvedge denim to merino hosiery
                and boxer briefs—is enzyme-tumbled, pumice-frosted, or hand-abraded so nothing ever
                arrives sterile or untouched.
              </p>

              {/* Six Mineral Pigments Bar */}
              <div className="pt-4 border-t border-[#1A1512]/10 space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#5A5248]">
                  Six House Mineral Pigments
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {BRAND_PIGMENTS.map((pigment) => (
                    <div key={pigment.id} className="space-y-1.5">
                      <div
                        className="h-8 w-full border border-[#1A1512]/10"
                        style={{ backgroundColor: pigment.hex }}
                        title={`${pigment.name} · ${pigment.pantoneTcx}`}
                      />
                      <div className="text-[10px] font-mono text-[#1A1512] truncate">
                        {pigment.name.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#FAF7F2] border border-[#1A1512]/10 overflow-hidden">
              <img
                src={BRAND.emblemLogoAsset}
                alt="stress Fault-Line Seal emblem geometry"
                className="w-full h-full object-cover aspect-[16/11]"
              />
            </div>
          </div>

          {/* Quiet House Dispatches Strip */}
          <div className="pt-12 border-t border-[#1A1512]/10">
            <div className="flex items-baseline justify-between gap-4 mb-6">
              <h3 className="font-brand-serif text-2xl text-[#1A1512]">Atelier Dispatches</h3>
              <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#5A5248]">
                {JOURNAL_ARTICLES.length} Essays
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {JOURNAL_ARTICLES.map((article) => (
                <article
                  key={article.id}
                  className="border-t border-[#1A1512]/15 pt-4 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#5A5248]">
                      {article.index} · {article.category}
                    </div>
                    <h4 className="mt-2 font-brand-serif text-lg text-[#1A1512] leading-snug">
                      <button
                        type="button"
                        onClick={() => setActiveArticle(article)}
                        className="text-left hover:text-[#1F3D2B] transition-colors cursor-pointer"
                      >
                        {article.title}
                      </button>
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-[#5A5248] line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveArticle(article)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-[#1F3D2B] hover:underline underline-offset-4 cursor-pointer self-start"
                  >
                    <span>Read</span>
                    <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clean Editorial Reader Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 bg-[#1A1512]/65 backdrop-blur-[2px] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="house-article-title"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="bg-[#FAF7F2] border border-[#1A1512]/15 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-[#FAF7F2]/95 backdrop-blur-xs px-6 py-4 border-b border-[#1A1512]/10 flex items-center justify-between gap-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#5A5248]">
                Dispatch {activeArticle.index} · {activeArticle.category} · {activeArticle.readTime}
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Close dispatch"
                className="w-9 h-9 border border-[#1A1512]/15 flex items-center justify-center hover:bg-[#EFE9DC] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-10 space-y-8">
              <div>
                <h2
                  id="house-article-title"
                  className="font-brand-serif text-3xl sm:text-4xl leading-[1.1] text-[#1A1512] text-balance"
                >
                  {activeArticle.title}
                </h2>
                <p className="mt-3 text-base text-[#4A433B] leading-relaxed">
                  {activeArticle.subtitle}
                </p>
                <div className="mt-4 text-xs font-mono text-[#5A5248]">
                  By {activeArticle.author} · {activeArticle.publishedAt}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  findGarment(activeArticle.featuredGarmentId),
                  findGarment(activeArticle.secondaryGarmentId),
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setActiveArticle(null);
                      onInspectGarment(g);
                    }}
                    className="text-left border border-[#1A1512]/10 bg-[#F5F0E6] cursor-pointer hover:border-[#1F3D2B]"
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden bg-[#EFE9DC]">
                      <img
                        src={g.image}
                        alt={g.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-3 py-2.5 border-t border-[#1A1512]/10 flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium text-[#1A1512] truncate">{g.name}</span>
                      <span className="font-mono text-[#1F3D2B] shrink-0">${g.price}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {activeArticle.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="font-brand-serif text-xl text-[#1A1512]">{sec.heading}</h3>
                    {sec.body.map((para, pIdx) => (
                      <p key={pIdx} className="text-[15px] leading-[1.7] text-[#3A342D]">
                        {para}
                      </p>
                    ))}
                    {sec.pullQuote && (
                      <blockquote className="my-6 py-4 px-6 bg-[#EFE9DC] border border-[#1A1512]/10 font-brand-serif italic text-xl text-[#1F3D2B] leading-snug">
                        &ldquo;{sec.pullQuote}&rdquo;
                      </blockquote>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
