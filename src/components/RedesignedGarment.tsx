import React, { useState } from 'react';
import { DYE_OPTIONS } from '../data/brand';
import {
  CustomGarmentOverrides,
  Garment,
  GarmentAngle,
  LogoFinish,
} from '../types/garment';

interface RedesignedGarmentProps {
  garment: Garment;
  mode?: 'redesigned' | 'original' | 'split';
  angle?: GarmentAngle;
  viewType?: 'garment' | 'model' | 'turnaround-grid';
  splitPercent?: number;
  overrides?: CustomGarmentOverrides;
  showPlacementPin?: boolean;
  className?: string;
}

const FINISH_HEX = {
  signature: ['#1F3D2B', '#4E6236', '#7F7F45', '#A98B5E', '#5B3A29', '#1A1512'],
  obsidian: '#1A1512',
  bone: '#F5F0E6',
  pine: '#1F3D2B',
  ochre: '#A98B5E',
};

const LETTERS = ['s', 't', 'r', 'e', 's', 's'];

const renderExtraWordmark = (finish: LogoFinish) => {
  const fill = finish === 'signature' ? '#1F3D2B' : FINISH_HEX[finish];
  return (
    <svg viewBox="0 0 225 48" className="w-full h-auto overflow-visible">
      <g transform="translate(4, 2) scale(0.55)">
        <path
          d="M35 8 L17 37 L31.5 37 L35 30 L51 49 L35.5 45.5 L49.5 66"
          fill="none"
          stroke={fill}
          strokeWidth="5"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <line
          x1="10"
          y1="66"
          x2="37"
          y2="66"
          stroke={fill}
          strokeWidth="5"
          strokeLinecap="butt"
        />
      </g>
      <text
        x="128"
        y="33"
        textAnchor="middle"
        fontFamily="'Bodoni Moda','Didot','Bodoni MT',Georgia,serif"
        fontSize="30"
        letterSpacing="3.5"
      >
        {LETTERS.map((ch, idx) => (
          <tspan
            key={idx}
            fill={
              finish === 'signature'
                ? FINISH_HEX.signature[idx]
                : FINISH_HEX[finish]
            }
          >
            {ch}
          </tspan>
        ))}
      </text>
    </svg>
  );
};

const QUADRANT_POS: Record<GarmentAngle, React.CSSProperties> = {
  front: { top: '-3%', left: '-3%' },
  back: { top: '-3%', right: '-3%' },
  left: { bottom: '-3%', left: '-3%' },
  right: { bottom: '-3%', right: '-3%' },
};

export const TurnaroundQuadrant: React.FC<{
  src: string;
  alt: string;
  angle: GarmentAngle;
  filter?: string;
}> = ({ src, alt, angle, filter = 'none' }) => (
  <div className="w-full h-full bg-[#F4F1EA] flex items-center justify-center overflow-hidden">
    <div className="relative w-full aspect-square max-h-full overflow-hidden">
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        className="absolute max-w-none transition-[filter] duration-200 select-none"
        style={{
          width: '214%',
          height: '214%',
          filter,
          ...QUADRANT_POS[angle],
        }}
      />
    </div>
  </div>
);

export const RedesignedGarment: React.FC<RedesignedGarmentProps> = ({
  garment,
  mode = 'redesigned',
  angle = 'front',
  viewType = 'garment',
  splitPercent = 50,
  overrides,
  showPlacementPin = false,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const activeDyeFilter =
    overrides && overrides.dye !== 'original'
      ? DYE_OPTIONS.find((d) => d.id === overrides.dye)?.filter ?? 'none'
      : 'none';

  const pinX = overrides?.showExtraMark ? overrides.logoX : garment.primaryLogo.x;
  const pinY = overrides?.showExtraMark ? overrides.logoY : garment.primaryLogo.y;

  const sampleImg =
    garment.sampleInspirations[0]?.image ?? garment.image;

  const renderNewDesignLayer = () => {
    if (viewType === 'model') {
      return (
        <div className="relative w-full h-full overflow-hidden bg-[#F5F0E6]">
          <img
            src={garment.modelImage}
            alt={`${garment.name} — worn in complete stress outfit`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-[filter] duration-200"
            style={{ filter: activeDyeFilter }}
          />
        </div>
      );
    }

    if (viewType === 'turnaround-grid') {
      return (
        <div className="relative w-full h-full overflow-hidden bg-[#F4F1EA] flex items-center justify-center">
          <img
            src={garment.turnaroundImage}
            alt={`${garment.name} — 4-angle turnaround sheet`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain transition-[filter] duration-200"
            style={{ filter: activeDyeFilter }}
          />
        </div>
      );
    }

    return (
      <div className="relative w-full h-full overflow-hidden bg-[#F5F0E6]">
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EFE9DC] text-[#5A5248]">
            <span className="font-brand-serif text-2xl lowercase tracking-widest text-[#1F3D2B]">
              stress
            </span>
            <span className="mt-2 text-xs font-medium text-[#1A1512]">
              {garment.name}
            </span>
          </div>
        ) : angle === 'front' ? (
          <img
            src={garment.image}
            alt={`${garment.name} — front view`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-[filter] duration-200"
            style={{ filter: activeDyeFilter }}
          />
        ) : (
          <TurnaroundQuadrant
            src={garment.turnaroundImage}
            alt={`${garment.name} — ${angle} view`}
            angle={angle}
            filter={activeDyeFilter}
          />
        )}

        {angle === 'front' && overrides?.showExtraMark && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${overrides.logoX}%`,
              top: `${overrides.logoY}%`,
              width: `${9 * overrides.logoScale}%`,
              transform: 'translate(-50%, -50%)',
              opacity: overrides.opacity,
            }}
          >
            {renderExtraWordmark(overrides.finish)}
          </div>
        )}

        {angle === 'front' && showPlacementPin && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${pinX}%`,
              top: `${pinY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-7 h-7 rounded-full border border-[#1F3D2B] bg-[#F5F0E6]/45 backdrop-blur-[1px] flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1F3D2B]" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSampleLayer = () => (
    <div className="relative w-full h-full overflow-hidden bg-[#EFE9DC] flex items-center justify-center">
      <img
        src={sampleImg}
        alt={`${garment.name} — fabric sample reference`}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
      />
    </div>
  );

  if (mode === 'original') {
    return <div className={`relative w-full h-full ${className}`}>{renderSampleLayer()}</div>;
  }

  if (mode === 'split') {
    return (
      <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
        <div className="absolute inset-0">{renderNewDesignLayer()}</div>

        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - splitPercent}% 0 0)`,
          }}
        >
          {renderSampleLayer()}
        </div>

        <div
          className="absolute top-0 bottom-0 w-[1px] bg-[#1A1512]/70 pointer-events-none"
          style={{ left: `${splitPercent}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F5F0E6] border border-[#1A1512]/40 shadow-sm flex items-center justify-center text-[10px] font-mono text-[#1A1512]">
            ↔
          </div>
        </div>
      </div>
    );
  }

  return <div className={`relative w-full h-full ${className}`}>{renderNewDesignLayer()}</div>;
};
