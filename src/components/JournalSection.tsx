import React, { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { JOURNAL_ARTICLES } from '../data/journal';
import { CustomGarmentOverrides, Garment, JournalArticle } from '../types/garment';
import { RedesignedGarment } from './RedesignedGarment';

interface JournalSectionProps {
  garments: Garment[];
  customOverridesMap: Record<string, CustomGarmentOverrides>;
  onInspectGarment: (garment: Garment) => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  garments,
  customOverridesMap,
  onInspectGarment,
}) => {
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(JOURNAL_ARTICLES.map((a) => a.category)))];

  const visibleArticles =
    categoryFilter === 'All'
      ? JOURNAL_ARTICLES
      : JOURNAL_ARTICLES.filter((a) => a.category === categoryFilter);

  const findGarment = (id: string) =>
    garments.find((g) => g.id === id) ?? garments[0];

  return (
    <section id="journal" className="border-b border-[#1A1512]/10 py-14 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#1A1512]/10">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5A5248]">
              The stress Journal · Brand Blog
            </p>
            <h2 className="mt-2 font-brand-serif text-3xl sm:text-4xl text-[#1A1512] text-balance">
              Dispatches from the dye house and pattern table.
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#1A1512] text-[#F5F0E6]'
                    : 'bg-[#FAF7F2] text-[#5A5248] border border-[#1A1512]/10 hover:text-[#1A1512]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Editorial Articles Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {visibleArticles.map((article) => {
            const featured = findGarment(article.featuredGarmentId);
            return (
              <article
                key={article.id}
                className="bg-[#FAF7F2] border border-[#1A1512]/10 rounded-lg overflow-hidden grid grid-cols-1 sm:grid-cols-12"
              >
                <div className="sm:col-span-5 aspect-[4/5] sm:aspect-auto sm:h-full overflow-hidden border-b sm:border-b-0 sm:border-r border-[#1A1512]/10">
                  <RedesignedGarment
                    garment={featured}
                    mode="redesigned"
                    overrides={customOverridesMap[featured.id]}
                  />
                </div>
                <div className="sm:col-span-7 p-6 flex flex-col justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#5A5248]">
                      <span className="font-mono tabular-nums">Essay {article.index}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="mt-3 font-brand-serif text-xl sm:text-2xl leading-snug text-[#1A1512] text-balance">
                      <button
                        type="button"
                        onClick={() => setActiveArticle(article)}
                        className="text-left hover:underline underline-offset-4 cursor-pointer"
                      >
                        {article.title}
                      </button>
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[#4A433B]">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1A1512]/10 flex items-center justify-between gap-3">
                    <span className="text-xs text-[#5A5248]">{article.publishedAt}</span>
                    <button
                      type="button"
                      onClick={() => setActiveArticle(article)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1F3D2B] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
                    >
                      <span>Read Dispatch</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 bg-[#1A1512]/60 backdrop-blur-[2px] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="journal-article-title"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="bg-[#FAF7F2] border border-[#1A1512]/15 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-[#FAF7F2]/95 backdrop-blur-xs px-6 py-4 border-b border-[#1A1512]/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#5A5248] font-mono">
                <span>Essay {activeArticle.index}</span>
                <span aria-hidden="true">·</span>
                <span>{activeArticle.category}</span>
                <span aria-hidden="true">·</span>
                <span>{activeArticle.readTime}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Close article"
                className="w-9 h-9 rounded-md border border-[#1A1512]/15 flex items-center justify-center text-[#1A1512] hover:bg-[#EFE9DC] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-10 space-y-8">
              <div>
                <h2
                  id="journal-article-title"
                  className="font-brand-serif text-3xl sm:text-4xl leading-[1.12] text-[#1A1512] text-balance"
                >
                  {activeArticle.title}
                </h2>
                <p className="mt-3 text-base text-[#4A433B] leading-relaxed">
                  {activeArticle.subtitle}
                </p>
                <div className="mt-4 text-xs text-[#5A5248]">
                  By {activeArticle.author} · {activeArticle.publishedAt}
                </div>
              </div>

              {/* Inline Lookbook Study Pair */}
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
                    className="group text-left border border-[#1A1512]/10 rounded-md overflow-hidden bg-[#F5F0E6] cursor-pointer"
                  >
                    <div className="aspect-[4/5] w-full overflow-hidden">
                      <RedesignedGarment
                        garment={g}
                        mode="redesigned"
                        overrides={customOverridesMap[g.id]}
                      />
                    </div>
                    <div className="px-3 py-2 border-t border-[#1A1512]/10 flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium text-[#1A1512] truncate">
                        {g.number} · {g.name}
                      </span>
                      <span className="font-mono text-[#1F3D2B] shrink-0">
                        Shop ${g.price}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Essay Body */}
              <div className="space-y-6">
                {activeArticle.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="font-brand-serif text-xl text-[#1A1512]">
                      {sec.heading}
                    </h3>
                    {sec.body.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-[15px] leading-[1.7] text-[#3A342D]"
                      >
                        {para}
                      </p>
                    ))}
                    {sec.pullQuote && (
                      <blockquote className="my-6 py-4 px-6 bg-[#EFE9DC] border border-[#1A1512]/10 rounded-md font-brand-serif italic text-xl text-[#1F3D2B] leading-snug">
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
    </section>
  );
};
