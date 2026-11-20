import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShoppingBag,
  X,
} from 'lucide-react';
import { COLLECTIONS, DYE_OPTIONS } from '../data/brand';
import {
  CustomGarmentOverrides,
  DyeId,
  Garment,
  GarmentAngle,
} from '../types/garment';
import { RedesignedGarment, TurnaroundQuadrant } from './RedesignedGarment';

interface AtelierModalProps {
  garment: Garment | null;
  allGarments: Garment[];
  savedOverrides?: CustomGarmentOverrides;
  onClose: () => void;
  onSelectGarment: (garment: Garment) => void;
  onSaveOverrides: (garmentId: string, overrides: CustomGarmentOverrides) => void;
  onResetOverrides: (garmentId: string) => void;
  onAddToBag: (garment: Garment, size: string, overrides?: CustomGarmentOverrides) => void;
  onOpenBag: () => void;
}

type StageTab = GarmentAngle | 'model';

const STAGE_TABS: { id: StageTab; label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'left', label: 'Left' },
  { id: 'right', label: 'Right' },
  { id: 'model', label: 'On Model' },
];

export const AtelierModal: React.FC<AtelierModalProps> = ({
  garment,
  allGarments,
  savedOverrides,
  onClose,
  onSelectGarment,
  onSaveOverrides,
  onResetOverrides,
  onAddToBag,
  onOpenBag,
}) => {
  const [stageTab, setStageTab] = useState<StageTab>('front');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [showSizingTable, setShowSizingTable] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const [draft, setDraft] = useState<CustomGarmentOverrides>({
    dye: 'original',
    finish: 'signature',
    opacity: 0.85,
    logoX: 50,
    logoY: 35,
    logoScale: 1,
    showExtraMark: false,
  });

  useEffect(() => {
    if (!garment) return;
    setSelectedSize(garment.sizes.includes('M') ? 'M' : garment.sizes[0]);
    setDraft(
      savedOverrides ?? {
        dye: 'original',
        finish: garment.primaryLogo.finish,
        opacity: garment.primaryLogo.opacity,
        logoX: garment.primaryLogo.x,
        logoY: garment.primaryLogo.y,
        logoScale: 1,
        showExtraMark: false,
      },
    );
    setStageTab('front');
    setShowSizingTable(false);
    setAddedFeedback(false);
  }, [garment, savedOverrides]);

  const pairedOutfitItems = useMemo(() => {
    if (!garment) return [];
    return garment.outfitItemIds
      .map((id) => allGarments.find((g) => g.id === id))
      .filter((g): g is Garment => Boolean(g));
  }, [garment, allGarments]);

  if (!garment) return null;

  const currentIdx = allGarments.findIndex((g) => g.id === garment.id);
  const prevGarment = allGarments[(currentIdx - 1 + allGarments.length) % allGarments.length];
  const nextGarment = allGarments[(currentIdx + 1) % allGarments.length];
  const colMeta = COLLECTIONS.find((c) => c.id === garment.collectionId);

  const isModified = draft.dye !== 'original';

  const handleReset = () => {
    const clean: CustomGarmentOverrides = {
      dye: 'original',
      finish: garment.primaryLogo.finish,
      opacity: garment.primaryLogo.opacity,
      logoX: garment.primaryLogo.x,
      logoY: garment.primaryLogo.y,
      logoScale: 1,
      showExtraMark: false,
    };
    setDraft(clean);
    onResetOverrides(garment.id);
  };

  const handleAdd = () => {
    if (isModified) {
      onSaveOverrides(garment.id, draft);
    }
    onAddToBag(garment, selectedSize, isModified ? draft : undefined);
    setAddedFeedback(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1A1512]/65 backdrop-blur-[2px] flex items-center justify-center p-2 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-garment-title"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF7F2] border border-[#1A1512]/12 max-w-6xl w-full max-h-[94vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal Luxury Modal Header */}
        <div className="px-5 sm:px-8 py-3.5 border-b border-[#1A1512]/10 flex items-center justify-between gap-4 bg-[#F5F0E6]">
          <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#5A5248] tabular-nums">
            Collection {colMeta?.number} · Look {garment.number} /{' '}
            {String(allGarments.length).padStart(2, '0')}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectGarment(prevGarment)}
              aria-label="Previous piece"
              className="w-9 h-9 border border-[#1A1512]/15 flex items-center justify-center hover:bg-[#EAE3D5] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onSelectGarment(nextGarment)}
              aria-label="Next piece"
              className="w-9 h-9 border border-[#1A1512]/15 flex items-center justify-center hover:bg-[#EAE3D5] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close product view"
              className="w-9 h-9 border border-[#1A1512]/15 flex items-center justify-center hover:bg-[#EAE3D5] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Split Product Gallery & Purchase Module */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Clean Multi-Angle & Model Fit Gallery */}
          <div className="lg:col-span-7 bg-[#EFE9DC] border-b lg:border-b-0 lg:border-r border-[#1A1512]/10 flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full max-h-[580px] mx-auto overflow-hidden">
              <RedesignedGarment
                garment={garment}
                angle={stageTab === 'model' ? 'front' : stageTab}
                viewType={stageTab === 'model' ? 'model' : 'garment'}
                overrides={draft}
              />
            </div>

            {/* Clean 5-Angle Thumbnail Selector */}
            <div className="p-3 sm:p-4 bg-[#FAF7F2] border-t border-[#1A1512]/10 grid grid-cols-5 gap-2.5">
              {STAGE_TABS.map((tab) => {
                const isSelected = stageTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStageTab(tab.id)}
                    className={`border overflow-hidden cursor-pointer transition-all text-left ${
                      isSelected
                        ? 'border-[#1F3D2B] ring-1 ring-[#1F3D2B]'
                        : 'border-[#1A1512]/12 hover:border-[#1A1512]/40'
                    }`}
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden bg-[#F4F1EA]">
                      {tab.id === 'model' ? (
                        <img
                          src={garment.modelImage}
                          alt={`${garment.name} on model`}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : tab.id === 'front' ? (
                        <img
                          src={garment.image}
                          alt={`${garment.name} front`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <TurnaroundQuadrant
                          src={garment.turnaroundImage}
                          alt={`${garment.name} ${tab.label}`}
                          angle={tab.id}
                        />
                      )}
                    </div>
                    <div className="px-1.5 py-1 text-[10px] font-mono text-center bg-[#F5F0E6] text-[#1A1512] truncate">
                      {tab.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#1F3D2B]">
                  {colMeta?.name} · {garment.category}
                </div>

                <div className="mt-2 flex items-baseline justify-between gap-4">
                  <h2
                    id="pdp-garment-title"
                    className="font-brand-serif text-2xl sm:text-3xl text-[#1A1512] text-balance"
                  >
                    {garment.name}
                  </h2>
                  <span className="text-xl font-mono font-medium text-[#1A1512] tabular-nums shrink-0">
                    ${garment.price.toLocaleString()}
                  </span>
                </div>

                {/* Pre-Order Allocation Notice */}
                <div className="mt-4 p-3.5 bg-[#EFE9DC]/75 border border-[#1A1512]/10 text-xs text-[#3A342D] space-y-1">
                  <div className="font-mono uppercase tracking-[0.1em] text-[#1F3D2B] font-medium">
                    AW26 Pre-Order · Batch 01 Allocation
                  </div>
                  <p className="leading-relaxed">
                    Produced strictly to pre-order reservation. Estimated dispatch Dec 15–30, 2026
                    with numbered Fault-Line Seal collar provenance.
                  </p>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[#4A433B]">
                  {garment.redesignNote}
                </p>

                <div className="mt-4 pt-4 border-t border-[#1A1512]/10 space-y-1.5 text-xs text-[#4A433B]">
                  <div>
                    <span className="text-[#5A5248] font-mono uppercase tracking-wider mr-2">
                      Textile:
                    </span>
                    <span className="text-[#1A1512]">
                      {garment.techPack.composition} ({garment.techPack.gsmOrWeight})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#5A5248] font-mono uppercase tracking-wider mr-2">
                      Finish:
                    </span>
                    <span className="text-[#1A1512]">{garment.washNote}</span>
                  </div>
                  <div>
                    <span className="text-[#5A5248] font-mono uppercase tracking-wider mr-2">
                      Distressed Spec:
                    </span>
                    <span className="text-[#1A1512]">{garment.techPack.distressingSop}</span>
                  </div>
                </div>
              </div>

              {/* Size Selector */}
              <div className="pt-4 border-t border-[#1A1512]/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium uppercase tracking-[0.08em] text-[#1A1512]">
                    Select Size
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizingTable((s) => !s)}
                    className="inline-flex items-center gap-1 text-[#1F3D2B] hover:underline underline-offset-4 cursor-pointer font-mono"
                  >
                    <span>Size Guide (cm)</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        showSizingTable ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {garment.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setSelectedSize(sz);
                        setAddedFeedback(false);
                      }}
                      className={`min-w-[48px] h-11 px-3.5 text-xs font-mono border transition-colors cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#1A1512] text-[#F5F0E6] border-[#1A1512]'
                          : 'bg-transparent text-[#1A1512] border-[#1A1512]/20 hover:border-[#1A1512]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {showSizingTable && (
                  <div className="p-3 bg-[#EFE9DC]/60 border border-[#1A1512]/10 space-y-2 text-[11px]">
                    <div className="font-mono uppercase tracking-wider text-[#5A5248]">
                      Garment Measurements · Size {selectedSize}
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {garment.techPack.sizeGrading.map((row, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between border-b border-[#1A1512]/8 pb-1 last:border-b-0 last:pb-0"
                        >
                          <span className="text-[#4A433B]">{row.pointOfMeasure}</span>
                          <span className="font-mono font-semibold text-[#1A1512] tabular-nums">
                            {row.values[selectedSize] ?? '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Bespoke Dye Bath Accordion (Quiet, Collapsed by Default) */}
              <details className="pt-4 border-t border-[#1A1512]/10 group">
                <summary className="list-none flex items-center justify-between text-xs font-medium uppercase tracking-[0.08em] text-[#5A5248] hover:text-[#1A1512] cursor-pointer">
                  <span>Bespoke Mineral Dye Request (Optional)</span>
                  {isModified ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleReset();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1F3D2B] cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </summary>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {DYE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, dye: opt.id as DyeId }))}
                      className={`flex items-center gap-2 px-2.5 py-2 text-xs border text-left transition-colors cursor-pointer ${
                        draft.dye === opt.id
                          ? 'bg-[#1F3D2B] text-[#F5F0E6] border-[#1F3D2B]'
                          : 'bg-[#F5F0E6] text-[#1A1512] border-[#1A1512]/15 hover:border-[#1A1512]/40'
                      }`}
                    >
                      <span
                        className="w-3 h-3 border border-black/15 shrink-0"
                        style={{ backgroundColor: opt.hex }}
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {opt.id === 'original' ? 'Original' : opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </details>

              {/* Styled On Model: Shop the Complete stress Outfit */}
              {pairedOutfitItems.length > 0 && (
                <div className="pt-4 border-t border-[#1A1512]/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium uppercase tracking-[0.08em] text-[#1A1512]">
                      Styled With on Model
                    </span>
                    <button
                      type="button"
                      onClick={() => setStageTab('model')}
                      className="text-[11px] font-mono text-[#1F3D2B] hover:underline cursor-pointer"
                    >
                      See Fit →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {pairedOutfitItems.map((piece) => (
                      <button
                        key={piece.id}
                        type="button"
                        onClick={() => onSelectGarment(piece)}
                        className="flex items-center gap-3 p-2 bg-[#F5F0E6] border border-[#1A1512]/10 hover:border-[#1F3D2B] transition-colors text-left cursor-pointer"
                      >
                        <img
                          src={piece.image}
                          alt={piece.name}
                          className="w-11 h-14 object-cover shrink-0 bg-[#EFE9DC]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-[#1A1512] truncate">
                            {piece.name}
                          </div>
                          <div className="text-[11px] font-mono text-[#5A5248] tabular-nums mt-0.5">
                            ${piece.price.toLocaleString()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Purchase CTA */}
            <div className="pt-5 border-t border-[#1A1512]/10 space-y-2.5">
              <button
                type="button"
                onClick={handleAdd}
                className={`w-full h-12 px-6 text-xs font-medium uppercase tracking-[0.12em] transition-colors inline-flex items-center justify-center gap-2.5 cursor-pointer ${
                  addedFeedback
                    ? 'bg-[#4E6236] text-[#F5F0E6]'
                    : 'bg-[#1F3D2B] text-[#F5F0E6] hover:bg-[#162D1F]'
                }`}
              >
                {addedFeedback ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>Reserved Size {selectedSize} in Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                    <span>Reserve Pre-Order · ${garment.price.toLocaleString()}</span>
                  </>
                )}
              </button>

              {addedFeedback && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBag();
                  }}
                  className="w-full h-10 text-xs font-medium uppercase tracking-[0.1em] border border-[#1A1512]/25 text-[#1A1512] hover:bg-[#EFE9DC] transition-colors cursor-pointer"
                >
                  Open Bag &amp; Complete Allocation →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
