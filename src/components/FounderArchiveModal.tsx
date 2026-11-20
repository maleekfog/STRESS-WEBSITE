import React from 'react';
import { X } from 'lucide-react';
import { CustomGarmentOverrides, Garment } from '../types/garment';
import { MoodBoardSection } from './MoodBoardSection';

interface FounderArchiveModalProps {
  isOpen: boolean;
  garments: Garment[];
  customOverridesMap: Record<string, CustomGarmentOverrides>;
  onClose: () => void;
  onInspectGarment: (garment: Garment) => void;
  onOpenTechPack: (garmentId?: string) => void;
}

export const FounderArchiveModal: React.FC<FounderArchiveModalProps> = ({
  isOpen,
  garments,
  customOverridesMap,
  onClose,
  onInspectGarment,
  onOpenTechPack,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1A1512]/70 backdrop-blur-[2px] flex items-center justify-center p-2 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Founder Studio & Creative Direction Dossier"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF7F2] border border-[#1A1512]/15 max-w-[1320px] w-full max-h-[94vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#1A1512]/10 bg-[#F5F0E6] flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#1F3D2B]">
              Founder &amp; Atelier Portal · Internal Studio View
            </div>
            <h2 className="font-brand-serif text-xl sm:text-2xl text-[#1A1512]">
              Creative Direction Mood Board &amp; Sample Pulls
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Founder Archive"
            className="w-10 h-10 border border-[#1A1512]/15 flex items-center justify-center hover:bg-[#EFE9DC] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <MoodBoardSection
            garments={garments}
            customOverridesMap={customOverridesMap}
            onInspectGarment={(g) => {
              onClose();
              onInspectGarment(g);
            }}
            onOpenTechPack={(id) => {
              onClose();
              onOpenTechPack(id);
            }}
          />
        </div>
      </div>
    </div>
  );
};
