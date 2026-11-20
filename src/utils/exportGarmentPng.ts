import { DYE_OPTIONS } from '../data/brand';
import { CustomGarmentOverrides, Garment, LogoFinish } from '../types/garment';

const SIGNATURE_COLORS = ['#1F3D2B', '#4E6236', '#7F7F45', '#A98B5E', '#5B3A29', '#1A1512'];
const LETTERS = ['s', 't', 'r', 'e', 's', 's'];

const FINISH_COLOR: Record<Exclude<LogoFinish, 'signature'>, string> = {
  obsidian: '#1A1512',
  bone: '#F5F0E6',
  pine: '#1F3D2B',
  ochre: '#A98B5E',
};

function drawExtraWordmark(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  widthPx: number,
  finish: LogoFinish,
  opacity: number,
) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.globalAlpha = opacity;

  const fontSize = Math.max(16, widthPx * 0.25);
  ctx.font = `400 ${fontSize}px "Bodoni Moda", Didot, Georgia, serif`;
  ctx.textBaseline = 'middle';

  const spacing = fontSize * 0.14;
  const charWidths = LETTERS.map((ch) => ctx.measureText(ch).width);
  const totalWidth =
    charWidths.reduce((a, b) => a + b, 0) + spacing * (LETTERS.length - 1);

  let cursorX = -totalWidth / 2;
  LETTERS.forEach((ch, idx) => {
    ctx.fillStyle =
      finish === 'signature' ? SIGNATURE_COLORS[idx] : FINISH_COLOR[finish];
    ctx.fillText(ch, cursorX, 0);
    cursorX += charWidths[idx] + spacing;
  });
  ctx.restore();
}

export async function exportGarmentPng(
  garment: Garment,
  overrides?: CustomGarmentOverrides,
): Promise<void> {
  const width = 1200;
  const height = 1600;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#F5F0E6';
  ctx.fillRect(0, 0, width, height);

  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load garment studio image'));
    img.src = garment.image;
  });

  const activeFilter =
    overrides && overrides.dye !== 'original'
      ? DYE_OPTIONS.find((d) => d.id === overrides.dye)?.filter ?? 'none'
      : 'none';

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const boxRatio = width / height;
  let drawW = width;
  let drawH = height;
  let drawX = 0;
  let drawY = 0;
  if (imgRatio > boxRatio) {
    drawW = height * imgRatio;
    drawX = (width - drawW) / 2;
  } else {
    drawH = width / imgRatio;
    drawY = (height - drawH) / 2;
  }

  ctx.filter = activeFilter;
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.filter = 'none';

  if (overrides?.showExtraMark) {
    drawExtraWordmark(
      ctx,
      (overrides.logoX / 100) * width,
      (overrides.logoY / 100) * height,
      ((9 * overrides.logoScale) / 100) * width,
      overrides.finish,
      overrides.opacity,
    );
  }

  ctx.fillStyle = '#1A1512';
  ctx.globalAlpha = 0.7;
  ctx.font = '500 18px "IBM Plex Mono", monospace';
  ctx.fillText(
    `stress · ${garment.number} ${garment.name.toUpperCase()} · COMPOSED UNDER PRESSURE`,
    44,
    height - 36,
  );

  const link = document.createElement('a');
  link.download = `stress-${garment.number}-${garment.id}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
