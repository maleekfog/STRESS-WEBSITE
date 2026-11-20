import React, { useMemo, useState } from 'react';
import { Download, FileSpreadsheet, Layers, SlidersHorizontal } from 'lucide-react';
import { BRAND, BRAND_PIGMENTS, COLLECTIONS, EDITORIAL_MOOD_PLATES } from '../data/brand';
import { CollectionId, CustomGarmentOverrides, Garment } from '../types/garment';
import { exportManufacturerDossierPdf } from '../utils/exportManufacturerPdf';
import { RedesignedGarment } from './RedesignedGarment';

interface MoodBoardSectionProps {
  garments: Garment[];
  customOverridesMap: Record<string, CustomGarmentOverrides>;
  onInspectGarment: (garment: Garment) => void;
  onOpenTechPack: (garmentId?: string) => void;
}

export const MoodBoardSection: React.FC<MoodBoardSectionProps> = ({
  garments,
  customOverridesMap,
  onInspectGarment,
  onOpenTechPack,
}) => {
  const [selectedCollection, setSelectedCollection] = useState<'all' | CollectionId>('all');
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'moodboard' | 'manufacturer'>('idle');
  const [pdfProgress, setPdfProgress] = useState(0);

  const visibleGarments = useMemo(
    () =>
      selectedCollection === 'all'
        ? garments
        : garments.filter((g) => g.collectionId === selectedCollection),
    [garments, selectedCollection],
  );

  const activeCollectionMeta = COLLECTIONS.find((c) => c.id === selectedCollection);

  const handleDownloadMoodBoardPdf = async () => {
    if (pdfStatus !== 'idle') return;
    setPdfStatus('moodboard');
    setPdfProgress(0);
    try {
      const label = activeCollectionMeta
        ? `Collection ${activeCollectionMeta.number}: ${activeCollectionMeta.name}`
        : `All 3 Collections (${visibleGarments.length} SKUs)`;
      await exportManufacturerDossierPdf(
        visibleGarments,
        'moodboard',
        label,
        setPdfProgress,
      );
    } finally {
      setPdfStatus('idle');
    }
  };

  const handleDownloadFactoryPdf = async () => {
    if (pdfStatus !== 'idle') return;
    setPdfStatus('manufacturer');
    setPdfProgress(0);
    try {
      const label = activeCollectionMeta
        ? `Collection ${activeCollectionMeta.number}: ${activeCollectionMeta.name}`
        : `All 3 Collections (${visibleGarments.length} SKUs)`;
      await exportManufacturerDossierPdf(
        visibleGarments,
        'manufacturer',
        label,
        setPdfProgress,
      );
    } finally {
      setPdfStatus('idle');
    }
  };

  return (
    <section
      id="mood-board"
      className="border-b border-[#1A1512]/10 py-14 lg:py-20 bg-[#EFE9DC]/55"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 space-y-12">
        {/* Top Creative Director Header & PDF Export Actions */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#1A1512]/10">
          <div className="space-y-2 max-w-[66ch]">
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#5A5248]">
              Creative Direction Mood Board · Sample → Silhouette Architecture
            </p>
            <h2 className="font-brand-serif text-3xl sm:text-4xl text-[#1A1512] text-balance">
              How {garments.length} new stress garments evolved from every raw studio pull.
            </h2>
            <p className="text-sm leading-relaxed text-[#4A433B]">
              Every plate below traces the direct design rationale behind each piece: the raw fabric
              or archival sample pulled onto the table, the external clutter stripped away, the
              mineral pigment dye formula applied, and exact subtle wordmark placement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadMoodBoardPdf}
              disabled={pdfStatus !== 'idle'}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium bg-[#FAF7F2] border border-[#1A1512]/25 text-[#1A1512] rounded-md hover:bg-[#EAE3D5] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {pdfStatus === 'moodboard'
                  ? `Building Mood Board (${pdfProgress}%)`
                  : 'Download Mood Board PDF'}
              </span>
            </button>
            <button
              type="button"
              onClick={handleDownloadFactoryPdf}
              disabled={pdfStatus !== 'idle'}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium bg-[#1F3D2B] text-[#F5F0E6] rounded-md hover:bg-[#162D1F] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {pdfStatus === 'manufacturer'
                  ? `Exporting Factory PDF (${pdfProgress}%)`
                  : 'Download Manufacturer PDF'}
              </span>
            </button>
          </div>
        </div>

        {/* Concept Atmosphere Strip: Monochrome Plates + 6-Pigment Swatch Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#1A1512]/10 rounded-lg p-6 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-[0.12em] text-[#1F3D2B]">
                House Premise & Color Temperature
              </div>
              <h3 className="font-brand-serif text-2xl text-[#1A1512]">
                &ldquo;{BRAND.slogan}&rdquo;
              </h3>
              <p className="text-sm leading-relaxed text-[#4A433B]">
                High-contrast monochrome archival references establish the silhouette attitude—calm
                upward defiance, heavy canvas drape, and raw textile edges—while our six Pantone
                TCX earth dyes harmonize every fabric into one urban wardrobe.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-[#1A1512]/10">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#5A5248]">
                Active Palette Governance
              </div>
              <div className="grid grid-cols-6 gap-2">
                {BRAND_PIGMENTS.map((p) => (
                  <div key={p.id} className="space-y-1">
                    <div
                      className="h-9 rounded-sm border border-[#1A1512]/10"
                      style={{ backgroundColor: p.hex }}
                      title={`${p.name} (${p.pantoneTcx})`}
                    />
                    <div className="text-[10px] font-mono text-[#1A1512] truncate">
                      {p.name.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {EDITORIAL_MOOD_PLATES.map((plate, i) => (
              <figure
                key={i}
                className="bg-[#FAF7F2] border border-[#1A1512]/10 rounded-lg overflow-hidden flex flex-col"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-[#1A1512]">
                  <img
                    src={plate.image}
                    alt={plate.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="p-3 flex-1 flex flex-col justify-between gap-1 border-t border-[#1A1512]/10">
                  <div className="text-[11px] font-semibold text-[#1A1512] leading-tight">
                    {plate.title}
                  </div>
                  <p className="text-[10px] leading-snug text-[#5A5248]">{plate.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Collection Filter Tabs for Mood Board */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedCollection('all')}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                selectedCollection === 'all'
                  ? 'bg-[#1A1512] text-[#F5F0E6]'
                  : 'bg-[#FAF7F2] text-[#5A5248] border border-[#1A1512]/10 hover:text-[#1A1512]'
              }`}
            >
              All Designs ({garments.length})
            </button>
            {COLLECTIONS.map((col) => {
              const count = garments.filter((g) => g.collectionId === col.id).length;
              const isActive = selectedCollection === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedCollection(col.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                    isActive
                      ? 'bg-[#1F3D2B] text-[#F5F0E6]'
                      : 'bg-[#FAF7F2] text-[#5A5248] border border-[#1A1512]/10 hover:text-[#1A1512]'
                  }`}
                >
                  {col.number}. {col.name} ({count})
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onOpenTechPack(visibleGarments[0]?.id)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1F3D2B] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Open Interactive Factory Tech Pack →</span>
          </button>
        </div>

        {/* Selected Collection Brief */}
        {activeCollectionMeta && (
          <div className="p-5 bg-[#FAF7F2] border border-[#1A1512]/10 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#1F3D2B]">
                Collection {activeCollectionMeta.number} · {activeCollectionMeta.season}
              </div>
              <h3 className="font-brand-serif text-2xl text-[#1A1512]">
                {activeCollectionMeta.name} — {activeCollectionMeta.subtitle}
              </h3>
              <p className="text-sm text-[#4A433B] max-w-[75ch]">
                {activeCollectionMeta.narrative}
              </p>
            </div>
            <div className="text-xs font-mono text-[#5A5248] md:text-right shrink-0">
              <div className="text-[#1A1512] font-semibold">Core Mills</div>
              <div className="mt-0.5 max-w-[32ch]">{activeCollectionMeta.fabricFocus}</div>
            </div>
          </div>
        )}

        {/* Complete Design-by-Design Mood Board Grid (Explaining Every Piece) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {visibleGarments.map((garment) => {
            const colMeta = COLLECTIONS.find((c) => c.id === garment.collectionId);
            return (
              <article
                key={garment.id}
                className="bg-[#FAF7F2] border border-[#1A1512]/10 rounded-lg overflow-hidden grid grid-cols-1 sm:grid-cols-12"
              >
                {/* Left Visual Plate: Finished Design + Sample Reference Strip */}
                <div className="sm:col-span-5 bg-[#EFE9DC] border-b sm:border-b-0 sm:border-r border-[#1A1512]/10 flex flex-col">
                  <button
                    type="button"
                    onClick={() => onInspectGarment(garment)}
                    className="relative aspect-[3/4] w-full overflow-hidden cursor-pointer text-left"
                    aria-label={`Inspect ${garment.name}`}
                  >
                    <RedesignedGarment
                      garment={garment}
                      mode="redesigned"
                      overrides={customOverridesMap[garment.id]}
                    />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-mono tabular-nums px-2 py-0.5 bg-[#F5F0E6]/90 text-[#1A1512] border border-[#1A1512]/10 rounded-xs">
                      Look {garment.number} · {garment.techPack.styleCode}
                    </span>
                  </button>

                  {/* Sample Pull Thumbnails */}
                  <div className="p-2.5 border-t border-[#1A1512]/10 bg-[#FAF7F2] space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#5A5248]">
                      Sample Reference Pulls ({garment.sampleInspirations.length})
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {garment.sampleInspirations.map((sample, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-2 min-w-0 bg-[#F5F0E6] border border-[#1A1512]/10 rounded p-1 shrink-0"
                        >
                          <img
                            src={sample.image}
                            alt={sample.label}
                            className="w-9 h-11 object-cover rounded-xs shrink-0"
                          />
                          <span className="text-[10px] text-[#4A433B] max-w-[125px] leading-tight line-clamp-2 pr-1">
                            {sample.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Creative Direction Breakdown */}
                <div className="sm:col-span-7 p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#1F3D2B]">
                        <span>{colMeta?.number}. {colMeta?.name}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#5A5248]">{garment.category}</span>
                      </div>
                      <h3 className="mt-1 font-brand-serif text-xl text-[#1A1512] leading-snug">
                        {garment.name}
                      </h3>
                    </div>

                    <p className="text-xs leading-relaxed text-[#3A342D]">
                      {garment.moodBoardNote}
                    </p>

                    <div className="pt-2.5 border-t border-[#1A1512]/8 space-y-2 text-[11px]">
                      <div>
                        <span className="font-mono uppercase text-[#5A5248]">Fabric & Dye: </span>
                        <span className="text-[#1A1512]">
                          {garment.fabricSpec} · {garment.techPack.pantoneRef}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono uppercase text-[#5A5248]">
                          Logo Execution:{' '}
                        </span>
                        <span className="text-[#1F3D2B] font-medium">
                          {garment.primaryLogo.label} ({garment.techPack.logoDimensionsMm})
                        </span>
                      </div>
                      <div>
                        <span className="font-mono uppercase text-[#5A5248]">
                          Sample Evolution:{' '}
                        </span>
                        <span className="text-[#4A433B]">
                          {garment.sampleInspirations[0]?.takeaway}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1A1512]/10 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onInspectGarment(garment)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A1512] hover:underline underline-offset-4 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Inspect Design &amp; Outfit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenTechPack(garment.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#1A1512]/20 text-[#1A1512] rounded hover:bg-[#EFE9DC] transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#1F3D2B]" aria-hidden="true" />
                      <span>Factory Tech Pack</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
