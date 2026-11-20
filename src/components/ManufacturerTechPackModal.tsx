import React, { useEffect, useMemo, useState } from 'react';
import { Download, FileSpreadsheet, Layers, X } from 'lucide-react';
import { BRAND_PIGMENTS, COLLECTIONS, FACTORY_TRIM_STANDARDS } from '../data/brand';
import { CollectionId, Garment, GarmentAngle } from '../types/garment';
import { exportManufacturerDossierPdf } from '../utils/exportManufacturerPdf';
import { RedesignedGarment, TurnaroundQuadrant } from './RedesignedGarment';

interface ManufacturerTechPackModalProps {
  isOpen: boolean;
  garments: Garment[];
  initialGarmentId?: string;
  onClose: () => void;
}

const ANGLES: { id: GarmentAngle; label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'left', label: 'Left Side' },
  { id: 'right', label: 'Right Side' },
];

export const ManufacturerTechPackModal: React.FC<ManufacturerTechPackModalProps> = ({
  isOpen,
  garments,
  initialGarmentId,
  onClose,
}) => {
  const [collectionFilter, setCollectionFilter] = useState<'all' | CollectionId>('all');
  const [selectedId, setSelectedId] = useState<string>(initialGarmentId ?? garments[0]?.id ?? '');
  const [activeAngle, setActiveAngle] = useState<GarmentAngle>('front');
  const [exportState, setExportState] = useState<'idle' | 'full' | 'single' | 'moodboard'>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen && initialGarmentId) {
      setSelectedId(initialGarmentId);
      setActiveAngle('front');
      const found = garments.find((g) => g.id === initialGarmentId);
      if (found) setCollectionFilter('all');
    }
  }, [isOpen, initialGarmentId, garments]);

  const filteredList = useMemo(
    () =>
      collectionFilter === 'all'
        ? garments
        : garments.filter((g) => g.collectionId === collectionFilter),
    [garments, collectionFilter],
  );

  const activeGarment = useMemo(
    () =>
      filteredList.find((g) => g.id === selectedId) ??
      filteredList[0] ??
      garments[0],
    [filteredList, selectedId, garments],
  );

  if (!isOpen || !activeGarment) return null;

  const activeCollection = COLLECTIONS.find((c) => c.id === activeGarment.collectionId);

  const handleExport = async (type: 'full' | 'single' | 'moodboard') => {
    if (exportState !== 'idle') return;
    setExportState(type);
    setProgress(0);
    try {
      if (type === 'single') {
        await exportManufacturerDossierPdf(
          [activeGarment],
          'manufacturer',
          `${activeGarment.techPack.styleCode} · ${activeGarment.name}`,
          setProgress,
        );
      } else if (type === 'moodboard') {
        const label =
          collectionFilter === 'all'
            ? `All 3 Collections (${filteredList.length} SKUs)`
            : `Collection: ${COLLECTIONS.find((c) => c.id === collectionFilter)?.name ?? ''}`;
        await exportManufacturerDossierPdf(filteredList, 'moodboard', label, setProgress);
      } else {
        const label =
          collectionFilter === 'all'
            ? `All 3 Collections (${filteredList.length} SKUs)`
            : `Collection: ${COLLECTIONS.find((c) => c.id === collectionFilter)?.name ?? ''}`;
        await exportManufacturerDossierPdf(filteredList, 'manufacturer', label, setProgress);
      }
    } finally {
      setExportState('idle');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1A1512]/70 backdrop-blur-[2px] flex items-center justify-center p-2 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tech-pack-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF7F2] border border-[#1A1512]/15 rounded-lg max-w-[1220px] w-full max-h-[94vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Factory Dossier Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-[#1A1512]/10 bg-[#F5F0E6] flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#1F3D2B]">
              Manufacturer Production Dossier · New Designs, 4 Sides, Materials & Sizings Only
            </div>
            <h2
              id="tech-pack-modal-title"
              className="font-brand-serif text-xl sm:text-2xl text-[#1A1512]"
            >
              AW26 Cut-and-Sew Tech Pack · {filteredList.length} Original SKUs (Sample Refs Excluded)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleExport('moodboard')}
              disabled={exportState !== 'idle'}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[#1A1512]/25 text-[#1A1512] rounded hover:bg-[#EAE3D5] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {exportState === 'moodboard'
                  ? `Rendering (${progress}%)`
                  : 'Mood Board PDF'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleExport('full')}
              disabled={exportState !== 'idle'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#1F3D2B] text-[#F5F0E6] rounded hover:bg-[#162D1F] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {exportState === 'full'
                  ? `Generating Tech Pack (${progress}%)`
                  : `Download Manufacturer PDF (${filteredList.length} SKUs)`}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Tech Pack Portal"
              className="w-8 h-8 rounded border border-[#1A1512]/15 flex items-center justify-center hover:bg-[#EAE3D5] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Split: SKU Sidebar + Full Factory Spec Sheet */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Style Selector Sidebar */}
          <aside className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#1A1512]/10 bg-[#F5F0E6]/70 flex flex-col max-h-[260px] lg:max-h-none overflow-hidden">
            <div className="p-3 border-b border-[#1A1512]/10 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCollectionFilter('all')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded cursor-pointer ${
                  collectionFilter === 'all'
                    ? 'bg-[#1A1512] text-[#F5F0E6]'
                    : 'bg-[#FAF7F2] text-[#5A5248] border border-[#1A1512]/10'
                }`}
              >
                All ({garments.length})
              </button>
              {COLLECTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCollectionFilter(c.id)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded cursor-pointer ${
                    collectionFilter === c.id
                      ? 'bg-[#1F3D2B] text-[#F5F0E6]'
                      : 'bg-[#FAF7F2] text-[#5A5248] border border-[#1A1512]/10'
                  }`}
                >
                  {c.number}. {c.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#1A1512]/8">
              {filteredList.map((g) => {
                const isSelected = g.id === activeGarment.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(g.id);
                      setActiveAngle('front');
                    }}
                    className={`w-full px-3.5 py-2.5 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#EFE9DC]' : 'hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <img
                      src={g.image}
                      alt={g.name}
                      className="w-10 h-12 object-cover rounded-xs border border-[#1A1512]/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-mono text-[#1F3D2B] tabular-nums">
                        {g.techPack.styleCode} · Look {g.number}
                      </div>
                      <div className="text-xs font-semibold text-[#1A1512] truncate">
                        {g.name}
                      </div>
                      <div className="text-[11px] text-[#5A5248] truncate">
                        {g.techPack.gsmOrWeight}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Detailed Tech-Pack Sheet */}
          <div className="lg:col-span-8 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* SKU Title Row */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#1A1512]/10">
              <div>
                <div className="text-xs font-mono text-[#1F3D2B]">
                  {activeGarment.techPack.styleCode} · Collection {activeCollection?.number}:{' '}
                  {activeCollection?.name}
                </div>
                <h3 className="mt-1 font-brand-serif text-2xl sm:text-3xl text-[#1A1512]">
                  {activeGarment.name}
                </h3>
                <p className="mt-1 text-xs text-[#5A5248]">
                  Size Run: {activeGarment.sizes.join(' / ')} · Category:{' '}
                  {activeGarment.category}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleExport('single')}
                disabled={exportState !== 'idle'}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-[#1A1512]/25 text-[#1A1512] rounded hover:bg-[#EFE9DC] cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#1F3D2B]" aria-hidden="true" />
                <span>
                  {exportState === 'single'
                    ? `Exporting (${progress}%)`
                    : `Export ${activeGarment.techPack.styleCode} PDF`}
                </span>
              </button>
            </div>

            {/* 4-Side Construction Views & Placement Spec (No Fabric Samples) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-5 bg-[#EFE9DC] border border-[#1A1512]/10 rounded-md overflow-hidden flex flex-col">
                <div className="px-2.5 py-2 bg-[#FAF7F2] border-b border-[#1A1512]/10 flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono text-[#1F3D2B] uppercase">
                    {activeAngle} view
                  </span>
                  <div className="flex items-center gap-1">
                    {ANGLES.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setActiveAngle(a.id)}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                          activeAngle === a.id
                            ? 'bg-[#1F3D2B] text-[#F5F0E6]'
                            : 'bg-[#EFE9DC] text-[#5A5248] hover:text-[#1A1512]'
                        }`}
                      >
                        {a.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <RedesignedGarment garment={activeGarment} angle={activeAngle} />
                </div>
              </div>

              <div className="sm:col-span-7 flex flex-col justify-between gap-3">
                {/* 4-Angle All-Sides Construction Grid */}
                <div className="bg-[#F5F0E6] border border-[#1A1512]/10 rounded-md p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#1F3D2B]">
                      All-Sides Turnaround Sheet (Front · Back · Left · Right)
                    </div>
                    <span className="text-[10px] font-mono text-[#5A5248]">Click angle</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ANGLES.map((ang) => {
                      const isCurrent = activeAngle === ang.id;
                      return (
                        <button
                          key={ang.id}
                          type="button"
                          onClick={() => setActiveAngle(ang.id)}
                          className={`group text-left rounded border overflow-hidden cursor-pointer transition-all ${
                            isCurrent
                              ? 'border-[#1F3D2B] ring-1 ring-[#1F3D2B]'
                              : 'border-[#1A1512]/15 hover:border-[#1A1512]/40'
                          }`}
                        >
                          <div className="aspect-square w-full overflow-hidden bg-[#F4F1EA]">
                            <TurnaroundQuadrant
                              src={activeGarment.turnaroundImage}
                              alt={`${activeGarment.name} — ${ang.label}`}
                              angle={ang.id}
                            />
                          </div>
                          <div className="px-2 py-1 text-[10px] font-mono text-center bg-[#FAF7F2] border-t border-[#1A1512]/10 text-[#1A1512]">
                            {ang.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Placement & Coordinate Card */}
                <div className="bg-[#EFE9DC]/70 border border-[#1A1512]/10 rounded-md p-3.5 space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#1F3D2B]">
                    Logo Application & Placement Spec
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#5A5248] block text-[10px] font-mono">Technique</span>
                      <span className="font-medium text-[#1A1512]">
                        {activeGarment.techPack.logoTechnique}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#5A5248] block text-[10px] font-mono">
                        Exact Dimensions
                      </span>
                      <span className="font-mono text-[#1A1512]">
                        {activeGarment.techPack.logoDimensionsMm}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-[#3A342D] pt-1 border-t border-[#1A1512]/10">
                    <span className="font-mono text-[10px] text-[#5A5248]">COORDINATES: </span>
                    {activeGarment.techPack.logoCoordinateOffsetMm}
                  </div>
                </div>
              </div>
            </div>

            {/* Fabric, Dye, Stitch & Hardware Spec Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F5F0E6] border border-[#1A1512]/10 rounded-md p-4 space-y-2.5 text-xs">
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#1F3D2B]">
                  01 / Materials Needed: Fabric & Yarn Specification
                </div>
                <div className="space-y-1.5 text-[#3A342D]">
                  <div>
                    <strong className="text-[#1A1512]">Type:</strong>{' '}
                    {activeGarment.techPack.fabricType}
                  </div>
                  <div>
                    <strong className="text-[#1A1512]">Composition:</strong>{' '}
                    {activeGarment.techPack.composition}
                  </div>
                  <div>
                    <strong className="text-[#1A1512]">Weight:</strong>{' '}
                    {activeGarment.techPack.gsmOrWeight}
                  </div>
                  <div>
                    <strong className="text-[#1A1512]">Structure:</strong>{' '}
                    {activeGarment.techPack.knitOrWeave}
                  </div>
                  <div>
                    <strong className="text-[#1A1512]">Shrinkage SOP:</strong>{' '}
                    {activeGarment.techPack.shrinkageSpec}
                  </div>
                </div>
              </div>

              <div className="bg-[#F5F0E6] border border-[#1A1512]/10 rounded-md p-4 space-y-2.5 text-xs">
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#1F3D2B]">
                  02 / Pantone Dye Bath & Wash SOP
                </div>
                <div className="space-y-1.5 text-[#3A342D]">
                  <div>
                    <strong className="text-[#1A1512]">Pantone Ref:</strong>{' '}
                    <span className="font-mono">{activeGarment.techPack.pantoneRef}</span>
                  </div>
                  <div>
                    <strong className="text-[#1A1512]">Dye Chemistry:</strong>{' '}
                    {activeGarment.techPack.dyeFormula}
                  </div>
                  <div>
                    <strong className="text-[#1A1512]">Distressing SOP:</strong>{' '}
                    {activeGarment.techPack.distressingSop}
                  </div>
                </div>
              </div>
            </div>

            {/* Stitch & Trims BOM */}
            <div className="bg-[#F5F0E6] border border-[#1A1512]/10 rounded-md p-4 space-y-2.5 text-xs">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#1F3D2B]">
                03 / Seam Construction & Bill of Materials (Trims BOM)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[#3A342D]">
                <div>
                  <strong className="text-[#1A1512]">Stitch Spec:</strong>{' '}
                  {activeGarment.techPack.stitchSpec}
                </div>
                <div>
                  <strong className="text-[#1A1512]">Interior Finish:</strong>{' '}
                  {activeGarment.techPack.seamFinish}
                </div>
              </div>
              <ul className="pt-2 border-t border-[#1A1512]/10 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#3A342D]">
                {activeGarment.techPack.trimsBom.map((trim, i) => (
                  <li key={i} className="font-mono text-[11px]">
                    • {trim}
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Grading Table */}
            <div className="bg-[#F5F0E6] border border-[#1A1512]/10 rounded-md overflow-hidden">
              <div className="px-4 py-2.5 bg-[#EFE9DC] border-b border-[#1A1512]/10 font-mono text-[11px] uppercase tracking-wider text-[#1F3D2B]">
                04 / Sizings & Grading Matrix (POM · Tolerance ±0.5 cm)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-[#1A1512]/10 text-[#5A5248] font-mono">
                    <tr>
                      <th className="py-2 px-4 font-medium">Point of Measure</th>
                      {activeGarment.sizes.map((sz) => (
                        <th key={sz} className="py-2 px-3 text-center font-semibold text-[#1A1512]">
                          {sz}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1512]/8">
                    {activeGarment.techPack.sizeGrading.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-4 text-[#3A342D]">{row.pointOfMeasure}</td>
                        {activeGarment.sizes.map((sz) => (
                          <td
                            key={sz}
                            className="py-2 px-3 text-center font-mono tabular-nums text-[#1A1512]"
                          >
                            {row.values[sz] ?? '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Global House Pantone & QC Standards Reference */}
            <div className="pt-2 border-t border-[#1A1512]/10 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="space-y-1.5">
                <div className="font-mono uppercase text-[#5A5248]">
                  House Pantone TCX Standards
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {BRAND_PIGMENTS.map((p) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-xs border border-black/15 shrink-0"
                        style={{ backgroundColor: p.hex }}
                      />
                      <span className="font-mono text-[#3A342D] truncate">
                        {p.pantoneTcx} · {p.name.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="font-mono uppercase text-[#5A5248]">Trim & QC Rules</div>
                {FACTORY_TRIM_STANDARDS.map((std) => (
                  <div key={std.code} className="text-[#4A433B] leading-snug">
                    <strong className="font-mono text-[#1F3D2B]">{std.code}:</strong> {std.spec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
