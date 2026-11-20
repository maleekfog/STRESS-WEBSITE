import React, { useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { COLLECTIONS } from '../data/brand';
import {
  CollectionId,
  CustomGarmentOverrides,
  Garment,
  GarmentAngle,
  GarmentCategory,
} from '../types/garment';
import { RedesignedGarment } from './RedesignedGarment';

interface CollectionGridProps {
  garments: Garment[];
  customOverridesMap: Record<string, CustomGarmentOverrides>;
  onInspectGarment: (garment: Garment) => void;
  onAddToBag: (garment: Garment, size: string) => void;
}

const CATEGORIES: ('All' | GarmentCategory)[] = [
  'All',
  'Outerwear & Knits',
  'Polos & Hoodies',
  'Tees & Tanks',
  'Bottoms',
  'Bags & Footwear',
  'Headwear & Accessories',
];

type SortOption = 'featured' | 'price-asc' | 'price-desc';

interface LuxuryProductCardProps {
  garment: Garment;
  viewMode: 'piece' | 'model';
  overrides?: CustomGarmentOverrides;
  selectedSize: string;
  isAdded: boolean;
  onSelectSize: (sz: string) => void;
  onQuickAdd: () => void;
  onInspect: (garment: Garment) => void;
}

const LuxuryProductCard: React.FC<LuxuryProductCardProps> = ({
  garment,
  viewMode,
  overrides,
  selectedSize,
  isAdded,
  onSelectSize,
  onQuickAdd,
  onInspect,
}) => {
  const [hoverAngle, setHoverAngle] = useState<GarmentAngle>('front');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== 'piece') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / Math.max(1, rect.width);
    if (ratio < 0.25) setHoverAngle('front');
    else if (ratio < 0.5) setHoverAngle('back');
    else if (ratio < 0.75) setHoverAngle('left');
    else setHoverAngle('right');
  };

  // In 'model' mode resting shows modelImage, hover reveals isolated garment
  const activeViewType =
    viewMode === 'model' ? (isHovered ? 'garment' : 'model') : 'garment';
  const activeAngle: GarmentAngle =
    viewMode === 'model' ? 'front' : hoverAngle;

  return (
    <article
      className="group flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoverAngle('front');
      }}
    >
      {/* Pure Gallery Frame (3:4 Aspect) */}
      <div
        onMouseMove={handleMouseMove}
        className={`relative aspect-[3/4] w-full overflow-hidden bg-[#EFE9DC] border border-[#1A1512]/8 transition-colors duration-200 ${
          viewMode === 'piece' ? 'cursor-ew-resize' : 'cursor-pointer'
        }`}
      >
        <button
          type="button"
          onClick={() => onInspect(garment)}
          className="w-full h-full block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F3D2B]"
          aria-label={`View ${garment.name} — $${garment.price}`}
        >
          <RedesignedGarment
            garment={garment}
            angle={activeAngle}
            viewType={activeViewType}
            overrides={overrides}
          />
        </button>

        {/* Quiet Single Angle Indicator During Hover Scrubbing */}
        {isHovered && viewMode === 'piece' && (
          <div className="pointer-events-none absolute top-3 left-3 px-2 py-0.5 bg-[#FAF7F2]/90 text-[10px] font-mono uppercase tracking-[0.12em] text-[#1A1512]">
            {hoverAngle}
          </div>
        )}

        {/* Restrained Quick-Size & Pre-Order Bar on Hover */}
        <div
          className={`absolute inset-x-0 bottom-0 p-3 bg-[#FAF7F2]/96 backdrop-blur-xs border-t border-[#1A1512]/10 transition-all duration-200 flex items-center justify-between gap-2 ${
            isHovered
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-1 overflow-x-auto">
            {garment.sizes.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSize(sz);
                }}
                className={`min-w-[28px] h-8 px-1.5 text-[10px] font-mono border transition-colors cursor-pointer shrink-0 ${
                  selectedSize === sz
                    ? 'bg-[#1A1512] text-[#F5F0E6] border-[#1A1512]'
                    : 'bg-transparent text-[#5A5248] border-[#1A1512]/15 hover:border-[#1A1512]'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd();
            }}
            className={`h-8 px-3 text-[10px] font-medium uppercase tracking-[0.08em] transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0 ${
              isAdded
                ? 'bg-[#4E6236] text-[#F5F0E6]'
                : 'bg-[#1F3D2B] text-[#F5F0E6] hover:bg-[#162D1F]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3" aria-hidden="true" />
                <span>Reserved</span>
              </>
            ) : (
              <span>Pre-Order</span>
            )}
          </button>
        </div>
      </div>

      {/* Strict 3-Line Quiet Luxury Metadata */}
      <div className="pt-3.5 space-y-1">
        <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#5A5248] flex items-center justify-between gap-2">
          <span className="truncate">{garment.category}</span>
          <span className="text-[#1F3D2B] shrink-0">Pre-Order</span>
        </div>

        <h3 className="text-[15px] font-medium text-[#1A1512] leading-snug">
          <button
            type="button"
            onClick={() => onInspect(garment)}
            className="text-left hover:text-[#1F3D2B] transition-colors cursor-pointer line-clamp-1"
          >
            {garment.name}
          </button>
        </h3>

        <div className="text-sm font-mono text-[#1A1512] tabular-nums">
          ${garment.price.toLocaleString()}
        </div>
      </div>
    </article>
  );
};

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  garments,
  customOverridesMap,
  onInspectGarment,
  onAddToBag,
}) => {
  const [selectedCollection, setSelectedCollection] = useState<'All' | CollectionId>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | GarmentCategory>('All');
  const [viewMode, setViewMode] = useState<'piece' | 'model'>('piece');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const filteredGarments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = garments.filter((g) => {
      const colMatch = selectedCollection === 'All' || g.collectionId === selectedCollection;
      const catMatch = selectedCategory === 'All' || g.category === selectedCategory;
      if (!colMatch || !catMatch) return false;
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.fabricSpec.toLowerCase().includes(q) ||
        g.number.includes(q)
      );
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [garments, selectedCollection, selectedCategory, searchQuery, sortBy]);

  const activeCollectionMeta = COLLECTIONS.find((c) => c.id === selectedCollection);

  const getSize = (g: Garment) =>
    selectedSizes[g.id] ?? (g.sizes.includes('M') ? 'M' : g.sizes[0]);

  const handleQuickAdd = (g: Garment) => {
    const size = getSize(g);
    onAddToBag(g, size);
    setRecentlyAddedId(g.id);
    window.setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === g.id ? null : prev));
    }, 1200);
  };

  return (
    <section id="shop" className="border-b border-[#1A1512]/10 py-14 lg:py-20">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
        {/* Clean Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#1A1512]/10">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#5A5248]">
              AW26 Collection · Open Pre-Order
            </p>
            <h2 className="mt-2 font-brand-serif text-3xl sm:text-4xl text-[#1A1512] text-balance">
              Batch 01 Silhouettes
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Minimal Garment vs On Model Switch */}
            <div className="inline-flex items-center p-0.5 bg-[#EFE9DC] border border-[#1A1512]/10 rounded-sm">
              <button
                type="button"
                onClick={() => setViewMode('piece')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                  viewMode === 'piece'
                    ? 'bg-[#FAF7F2] text-[#1A1512] shadow-2xs'
                    : 'text-[#5A5248] hover:text-[#1A1512]'
                }`}
              >
                Garment
              </button>
              <button
                type="button"
                onClick={() => setViewMode('model')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                  viewMode === 'model'
                    ? 'bg-[#FAF7F2] text-[#1A1512] shadow-2xs'
                    : 'text-[#5A5248] hover:text-[#1A1512]'
                }`}
              >
                On Model
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort silhouettes"
              className="h-9 px-3 text-xs bg-[#FAF7F2] border border-[#1A1512]/15 rounded-sm text-[#1A1512] focus:outline-none focus:border-[#1F3D2B] cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Minimal Collection Line Tabs */}
        <div className="mt-6 flex items-center gap-6 border-b border-[#1A1512]/10 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedCollection('All')}
            className={`pb-3 text-xs font-medium uppercase tracking-[0.08em] whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer tabular-nums ${
              selectedCollection === 'All'
                ? 'border-[#1F3D2B] text-[#1A1512]'
                : 'border-transparent text-[#5A5248] hover:text-[#1A1512]'
            }`}
          >
            All ({garments.length})
          </button>

          {COLLECTIONS.map((col) => {
            const count = garments.filter((g) => g.collectionId === col.id).length;
            const isSelected = selectedCollection === col.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setSelectedCollection(col.id)}
                className={`pb-3 text-xs font-medium uppercase tracking-[0.08em] whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer tabular-nums ${
                  isSelected
                    ? 'border-[#1F3D2B] text-[#1A1512]'
                    : 'border-transparent text-[#5A5248] hover:text-[#1A1512]'
                }`}
              >
                {col.number}. {col.name} ({count})
              </button>
            );
          })}
        </div>

        {activeCollectionMeta && (
          <p className="mt-4 text-xs leading-relaxed text-[#5A5248] max-w-[78ch]">
            <span className="font-mono text-[#1F3D2B] uppercase mr-2">
              {activeCollectionMeta.season} ·
            </span>
            {activeCollectionMeta.narrative}
          </p>
        )}

        {/* Secondary Category Filter Strip + Search */}
        <div className="mt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const scopePool =
                selectedCollection === 'All'
                  ? garments
                  : garments.filter((g) => g.collectionId === selectedCollection);
              const count =
                cat === 'All'
                  ? scopePool.length
                  : scopePool.filter((g) => g.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer tabular-nums ${
                    isActive
                      ? 'text-[#1A1512] font-semibold underline underline-offset-4'
                      : 'text-[#5A5248] hover:text-[#1A1512]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-60 shrink-0">
            <Search
              className="w-3.5 h-3.5 text-[#5A5248] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search piece or fabric..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#FAF7F2] border border-[#1A1512]/15 rounded-sm text-[#1A1512] placeholder:text-[#7A7065] focus:outline-none focus:border-[#1F3D2B]"
            />
          </div>
        </div>

        {/* Clean 4-Column Luxury Gallery Grid */}
        {filteredGarments.length === 0 ? (
          <div className="mt-12 py-16 text-center border border-[#1A1512]/10 bg-[#FAF7F2]">
            <p className="text-sm text-[#5A5248]">
              No pieces matched your current filter selection.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedCollection('All');
              }}
              className="mt-4 px-5 h-10 text-xs font-medium uppercase tracking-[0.08em] bg-[#1A1512] text-[#F5F0E6] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredGarments.map((garment) => (
              <LuxuryProductCard
                key={garment.id}
                garment={garment}
                viewMode={viewMode}
                overrides={customOverridesMap[garment.id]}
                selectedSize={getSize(garment)}
                isAdded={recentlyAddedId === garment.id}
                onSelectSize={(sz) =>
                  setSelectedSizes((prev) => ({ ...prev, [garment.id]: sz }))
                }
                onQuickAdd={() => handleQuickAdd(garment)}
                onInspect={onInspectGarment}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
