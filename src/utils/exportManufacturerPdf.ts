import { jsPDF } from 'jspdf';
import {
  BRAND,
  BRAND_PIGMENTS,
  COLLECTIONS,
  EDITORIAL_MOOD_PLATES,
  FACTORY_TRIM_STANDARDS,
} from '../data/brand';
import { Garment } from '../types/garment';

interface LoadedImage {
  dataUrl: string;
  width: number;
  height: number;
}

interface TurnaroundQuadrants {
  front: LoadedImage | null;
  back: LoadedImage | null;
  left: LoadedImage | null;
  right: LoadedImage | null;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

async function loadImageJpeg(url: string, maxDim = 560): Promise<LoadedImage | null> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load ${url}`));
      img.src = url;
    });

    const natW = img.naturalWidth || 400;
    const natH = img.naturalHeight || 500;
    const scale = Math.min(1, maxDim / Math.max(natW, natH));
    const w = Math.max(1, Math.round(natW * scale));
    const h = Math.max(1, Math.round(natH * scale));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#F5F0E6';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    return {
      dataUrl: canvas.toDataURL('image/jpeg', 0.8),
      width: w,
      height: h,
    };
  } catch {
    return null;
  }
}

async function loadTurnaroundQuadrants(
  url: string,
  quadSize = 360,
): Promise<TurnaroundQuadrants> {
  const empty: TurnaroundQuadrants = { front: null, back: null, left: null, right: null };
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load ${url}`));
      img.src = url;
    });

    const natW = img.naturalWidth || 1024;
    const natH = img.naturalHeight || 1024;

    const slice = (rx: number, ry: number, rw: number, rh: number): LoadedImage | null => {
      const canvas = document.createElement('canvas');
      canvas.width = quadSize;
      canvas.height = quadSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = '#F4F1EA';
      ctx.fillRect(0, 0, quadSize, quadSize);
      ctx.drawImage(
        img,
        natW * rx,
        natH * ry,
        natW * rw,
        natH * rh,
        0,
        0,
        quadSize,
        quadSize,
      );
      return {
        dataUrl: canvas.toDataURL('image/jpeg', 0.82),
        width: quadSize,
        height: quadSize,
      };
    };

    // Crop slightly inside each quadrant to eliminate the hairline center crosshair
    return {
      front: slice(0.015, 0.015, 0.47, 0.47),
      back: slice(0.515, 0.015, 0.47, 0.47),
      left: slice(0.015, 0.515, 0.47, 0.47),
      right: slice(0.515, 0.515, 0.47, 0.47),
    };
  } catch {
    return empty;
  }
}

function drawFittedImage(
  doc: jsPDF,
  loaded: LoadedImage | null,
  x: number,
  y: number,
  boxW: number,
  boxH: number,
) {
  if (!loaded) {
    doc.setFillColor(239, 233, 220);
    doc.rect(x, y, boxW, boxH, 'F');
    return;
  }
  const imgRatio = loaded.width / loaded.height;
  const boxRatio = boxW / boxH;
  let drawW = boxW;
  let drawH = boxH;
  if (imgRatio > boxRatio) {
    drawH = boxW / imgRatio;
  } else {
    drawW = boxH * imgRatio;
  }
  const offsetX = x + (boxW - drawW) / 2;
  const offsetY = y + (boxH - drawH) / 2;
  doc.addImage(loaded.dataUrl, 'JPEG', offsetX, offsetY, drawW, drawH);
}

function drawStressWordmarkPdf(doc: jsPDF, x: number, y: number, fontSize = 22) {
  const letters = ['s', 't', 'r', 'e', 's', 's'];
  const colors = ['#1F3D2B', '#4E6236', '#7F7F45', '#A98B5E', '#5B3A29', '#1A1512'];
  doc.setFont('times', 'normal');
  doc.setFontSize(fontSize);
  let cursor = x;
  letters.forEach((ch, idx) => {
    const [r, g, b] = hexToRgb(colors[idx]);
    doc.setTextColor(r, g, b);
    doc.text(ch, cursor, y);
    cursor += doc.getTextWidth(ch) + fontSize * 0.05;
  });
}

function paintBonePage(doc: jsPDF) {
  doc.setFillColor(245, 240, 230); // #F5F0E6 Warm Bone
  doc.rect(0, 0, 297, 210, 'F');
}

function drawPageFooter(doc: jsPDF, label: string, pageNum: number, totalPages: number) {
  doc.setDrawColor(210, 202, 188);
  doc.line(14, 198, 283, 198);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 82, 72);
  doc.text(`stress · ${BRAND.slogan.toUpperCase()} · ${label}`, 14, 203.5);
  doc.text(`PAGE ${String(pageNum).padStart(2, '0')} / ${String(totalPages).padStart(2, '0')}`, 283, 203.5, {
    align: 'right',
  });
}

export async function exportManufacturerDossierPdf(
  garments: Garment[],
  mode: 'manufacturer' | 'moodboard',
  scopeLabel = 'All 3 Collections (70 SKUs)',
  onProgress?: (pct: number) => void,
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  onProgress?.(5);
  const totalSteps =
    garments.length + (mode === 'moodboard' ? EDITORIAL_MOOD_PLATES.length : 0);
  let loadedCount = 0;

  if (mode === 'manufacturer') {
    // --------------------------------------------------------------------------
    // MANUFACTURER MODE: NEW DESIGNS + ALL 4 SIDES + MATERIALS + SIZING ONLY
    // (ZERO FABRIC OR INSPIRATION SAMPLES INCLUDED)
    // --------------------------------------------------------------------------
    const mfgAssets = new Map<
      string,
      { main: LoadedImage | null; quads: TurnaroundQuadrants }
    >();

    for (const g of garments) {
      const main = await loadImageJpeg(g.image, 520);
      const quads = await loadTurnaroundQuadrants(g.turnaroundImage, 340);
      mfgAssets.set(g.id, { main, quads });
      loadedCount += 1;
      onProgress?.(Math.min(82, Math.round((loadedCount / Math.max(1, totalSteps)) * 77) + 5));
    }

    const lineSheetPages = Math.max(1, Math.ceil(garments.length / 20));
    const totalPages = 1 + lineSheetPages + garments.length;

    // PAGE 1: MASTER PRODUCTION STANDARD & PANTONE DYE FORMULAS
    paintBonePage(doc);
    drawStressWordmarkPdf(doc, 14, 21, 26);

    doc.setFont('courier', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 82, 72);
    doc.text('FACTORY PRODUCTION DOSSIER & CUT-AND-SEW SPEC', 283, 15, { align: 'right' });
    doc.text(`SCOPE: ${scopeLabel.toUpperCase()}`, 283, 20, { align: 'right' });

    doc.setDrawColor(26, 21, 18);
    doc.setLineWidth(0.35);
    doc.line(14, 26, 283, 26);

    doc.setFont('times', 'normal');
    doc.setFontSize(18);
    doc.setTextColor(26, 21, 18);
    doc.text(`${BRAND.slogan} — Mill Materials, Dye Formulas & Sizing Standard`, 14, 35);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(74, 67, 59);
    doc.text(
      'Production-only specification packet for new stress designs. Includes 4-side garment views (Front, Back, Left, Right), materials & trims BOM, Pantone TCX dye chemistry, and graded POM size runs.',
      14,
      41,
    );

    // 6-Color Dye Bath Formula Cards
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(31, 61, 43);
    doc.text('01 / SIX-PIGMENT DYE BATH & PANTONE TCX MASTER STANDARD', 14, 50);

    BRAND_PIGMENTS.forEach((p, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const cx = 14 + col * 91;
      const cy = 54 + row * 28;

      doc.setFillColor(250, 247, 242);
      doc.setDrawColor(215, 208, 196);
      doc.rect(cx, cy, 87, 24, 'FD');

      const [r, g, b] = hexToRgb(p.hex);
      doc.setFillColor(r, g, b);
      doc.rect(cx + 3, cy + 3, 12, 18, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(26, 21, 18);
      doc.text(`${p.name} (${p.letter})`, cx + 18, cy + 7);

      doc.setFont('courier', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(90, 82, 72);
      doc.text(`${p.hex} · ${p.pantoneTcx}`, cx + 18, cy + 11.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      const chemLines = doc.splitTextToSize(p.dyeChemistry, 66);
      doc.text(chemLines.slice(0, 2), cx + 18, cy + 16);
    });

    // Trim & QC Factory Standards
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(31, 61, 43);
    doc.text('02 / MANDATORY LABEL, EMBROIDERY & QC STANDARDS', 14, 117);

    FACTORY_TRIM_STANDARDS.forEach((std, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const sx = 14 + col * 136;
      const sy = 121 + row * 21;

      doc.setFillColor(250, 247, 242);
      doc.setDrawColor(215, 208, 196);
      doc.rect(sx, sy, 132, 18, 'FD');

      doc.setFont('courier', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(31, 61, 43);
      doc.text(`${std.code} · ${std.title}`, sx + 3, sy + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(58, 52, 45);
      const specLines = doc.splitTextToSize(std.spec, 125);
      doc.text(specLines.slice(0, 2), sx + 3, sy + 10.5);
    });

    // Collections Architecture Summary Bar
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(31, 61, 43);
    doc.text('03 / COLLECTION ARCHITECTURE & FABRIC ALLOCATION', 14, 168);

    COLLECTIONS.forEach((c, idx) => {
      const bx = 14 + idx * 91;
      doc.setFillColor(239, 233, 220);
      doc.rect(bx, 171, 87, 22, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(26, 21, 18);
      doc.text(`${c.number}. ${c.name}`, bx + 3, 176.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(74, 67, 59);
      const lines = doc.splitTextToSize(c.fabricFocus, 81);
      doc.text(lines.slice(0, 3), bx + 3, 181.5);
    });

    drawPageFooter(doc, 'MASTER FACTORY STANDARDS', 1, totalPages);

    // PAGINATED PRODUCTION LINE SHEET (20 PER PAGE)
    for (let lsIdx = 0; lsIdx < lineSheetPages; lsIdx++) {
      doc.addPage();
      paintBonePage(doc);
      doc.setFont('courier', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(31, 61, 43);
      const sheetSuffix = lineSheetPages > 1 ? ` · SHEET ${lsIdx + 1}/${lineSheetPages}` : '';
      doc.text(
        `PRODUCTION LINE SHEET (NEW DESIGNS ONLY) · ${scopeLabel.toUpperCase()}${sheetSuffix}`,
        14,
        15,
      );
      doc.setDrawColor(26, 21, 18);
      doc.line(14, 18, 283, 18);

      const cols = 5;
      const cellW = 51.5;
      const cellH = 42;
      garments.slice(lsIdx * 20, (lsIdx + 1) * 20).forEach((g, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const gx = 14 + col * (cellW + 2.8);
        const gy = 22 + row * (cellH + 2.2);

        doc.setFillColor(250, 247, 242);
        doc.setDrawColor(215, 208, 196);
        doc.rect(gx, gy, cellW, cellH, 'FD');

        const assets = mfgAssets.get(g.id);
        drawFittedImage(doc, assets?.main ?? null, gx + 1.5, gy + 1.5, 22, 29);

        doc.setFont('courier', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(31, 61, 43);
        doc.text(g.techPack.styleCode, gx + 25, gy + 5.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.8);
        doc.setTextColor(26, 21, 18);
        const nLines = doc.splitTextToSize(g.name, 25);
        doc.text(nLines.slice(0, 3), gx + 25, gy + 9.5);

        doc.setFont('courier', 'normal');
        doc.setFontSize(5.8);
        doc.setTextColor(90, 82, 72);
        const gLines = doc.splitTextToSize(g.techPack.gsmOrWeight, 25);
        doc.text(gLines.slice(0, 2), gx + 25, gy + 24);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.6);
        doc.text(`Sizes: ${g.sizes.join('/')}`, gx + 1.5, gy + 35);
        const pLines = doc.splitTextToSize(g.techPack.pantoneRef, cellW - 3);
        doc.text(pLines[0] ?? '', gx + 1.5, gy + 39);
      });

      drawPageFooter(doc, `PRODUCTION LINE SHEET${sheetSuffix}`, 2 + lsIdx, totalPages);
    }

    // INDIVIDUAL SKU SPEC SHEETS (TARGET DESIGN + ALL 4 SIDES + MATERIALS + SIZING)
    garments.forEach((g, idx) => {
      doc.addPage();
      paintBonePage(doc);
      const pageNum = idx + 2 + lineSheetPages;
      const collection = COLLECTIONS.find((c) => c.id === g.collectionId);
      const assets = mfgAssets.get(g.id);

      // Header band
      doc.setFont('courier', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(31, 61, 43);
      doc.text(
        `${g.techPack.styleCode} · LOOK ${g.number} · COLLECTION ${collection?.number ?? ''} (${collection?.name ?? ''})`,
        14,
        13,
      );
      doc.setTextColor(90, 82, 72);
      doc.text(`SIZE RUN: ${g.sizes.join(' / ')}`, 283, 13, { align: 'right' });

      doc.setFont('times', 'normal');
      doc.setFontSize(17);
      doc.setTextColor(26, 21, 18);
      doc.text(g.name, 14, 21);

      doc.setDrawColor(26, 21, 18);
      doc.setLineWidth(0.3);
      doc.line(14, 24, 283, 24);

      // Left column top: Hero Front View (y = 28..108)
      doc.setFillColor(250, 247, 242);
      doc.setDrawColor(210, 202, 188);
      doc.rect(14, 28, 86, 80, 'FD');
      drawFittedImage(doc, assets?.main ?? null, 16, 29.5, 82, 71);
      doc.setFont('courier', 'bold');
      doc.setFontSize(6.6);
      doc.setTextColor(31, 61, 43);
      doc.text('NEW STRESS DESIGN · HERO VIEW', 16, 105.5);

      // Left column bottom: ALL 4 SIDES CONSTRUCTION TURNAROUND (y = 111..193)
      doc.setFillColor(250, 247, 242);
      doc.setDrawColor(210, 202, 188);
      doc.rect(14, 111, 86, 82, 'FD');
      doc.setFillColor(239, 233, 220);
      doc.rect(14, 111, 86, 5.5, 'F');
      doc.setFont('courier', 'bold');
      doc.setFontSize(6.6);
      doc.setTextColor(31, 61, 43);
      doc.text('ALL-SIDES CONSTRUCTION (4 ANGLES)', 16, 115);

      const quadEntries: [string, LoadedImage | null][] = [
        ['FRONT', assets?.quads.front ?? null],
        ['BACK', assets?.quads.back ?? null],
        ['LEFT SIDE', assets?.quads.left ?? null],
        ['RIGHT SIDE', assets?.quads.right ?? null],
      ];

      quadEntries.forEach(([lbl, qImg], qIdx) => {
        const qCol = qIdx % 2;
        const qRow = Math.floor(qIdx / 2);
        const qx = 16 + qCol * 41.5;
        const qy = 118 + qRow * 36.5;

        doc.setFillColor(244, 241, 234);
        doc.setDrawColor(220, 212, 200);
        doc.rect(qx, qy, 40, 35, 'FD');
        drawFittedImage(doc, qImg, qx + 1, qy + 1, 38, 29);

        doc.setFont('courier', 'bold');
        doc.setFontSize(5.8);
        doc.setTextColor(26, 21, 18);
        doc.text(lbl, qx + 20, qy + 33.2, { align: 'center' });
      });

      // Right area: Structured Factory BOM & SOP Tables (Materials & Sizing Only)
      const rx = 105;
      const rw = 178;

      const drawSpecBlock = (
        yStart: number,
        h: number,
        heading: string,
        rows: [string, string][],
      ) => {
        doc.setFillColor(250, 247, 242);
        doc.setDrawColor(210, 202, 188);
        doc.rect(rx, yStart, rw, h, 'FD');

        doc.setFillColor(239, 233, 220);
        doc.rect(rx, yStart, rw, 5.5, 'F');
        doc.setFont('courier', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(31, 61, 43);
        doc.text(heading, rx + 3, yStart + 4);

        let curY = yStart + 9.5;
        rows.forEach(([k, v]) => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.2);
          doc.setTextColor(26, 21, 18);
          doc.text(`${k}:`, rx + 3, curY);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(58, 52, 45);
          const wrapped = doc.splitTextToSize(v, rw - 42);
          doc.text(wrapped.slice(0, 2), rx + 38, curY);
          curY += Math.max(4.5, wrapped.slice(0, 2).length * 3.7 + 1);
        });
      };

      drawSpecBlock(28, 35, '01 / MATERIALS NEEDED: FABRIC, COMPOSITION & WEAVE', [
        ['Fabric Type', g.techPack.fabricType],
        ['Composition', g.techPack.composition],
        ['Weight / GSM', g.techPack.gsmOrWeight],
        ['Knit / Weave', g.techPack.knitOrWeave],
        ['Shrinkage SOP', g.techPack.shrinkageSpec],
      ]);

      drawSpecBlock(65, 32, '02 / PANTONE DYE FORMULA & SURFACE FINISH SOP', [
        ['Pantone Ref', g.techPack.pantoneRef],
        ['Dye Formula', g.techPack.dyeFormula],
        ['Distress / Cure', g.techPack.distressingSop],
      ]);

      drawSpecBlock(99, 26, '03 / STITCHING, SEAMS & HARDWARE / TRIMS BOM', [
        ['Stitch Spec', g.techPack.stitchSpec],
        ['Seam Finish', g.techPack.seamFinish],
        ['Trims BOM', g.techPack.trimsBom.join(' · ')],
      ]);

      drawSpecBlock(127, 25, '04 / SUBTLE LOGO PLACEMENT & COORDINATES', [
        ['Technique', g.techPack.logoTechnique],
        ['Dimensions', g.techPack.logoDimensionsMm],
        ['Coordinates', g.techPack.logoCoordinateOffsetMm],
      ]);

      // Block 05: Size Grading POM Table
      doc.setFillColor(250, 247, 242);
      doc.setDrawColor(210, 202, 188);
      doc.rect(rx, 154, rw, 39, 'FD');
      doc.setFillColor(239, 233, 220);
      doc.rect(rx, 154, rw, 5.5, 'F');
      doc.setFont('courier', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(31, 61, 43);
      doc.text('05 / SIZINGS & GRADING MATRIX (TOLERANCE ±0.5 CM)', rx + 3, 158);

      const szCols = g.sizes;
      const pomW = 58;
      const szColW = (rw - pomW - 6) / Math.max(1, szCols.length);

      doc.setFont('courier', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(26, 21, 18);
      doc.text('Point of Measure', rx + 3, 164.5);
      szCols.forEach((sz, sIdx) => {
        doc.text(sz, rx + pomW + sIdx * szColW + szColW / 2, 164.5, { align: 'center' });
      });
      doc.setDrawColor(215, 208, 196);
      doc.line(rx + 3, 166.5, rx + rw - 3, 166.5);

      g.techPack.sizeGrading.slice(0, 3).forEach((row, rIdx) => {
        const ry = 172 + rIdx * 7.2;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(58, 52, 45);
        doc.text(row.pointOfMeasure, rx + 3, ry);
        doc.setFont('courier', 'bold');
        szCols.forEach((sz, sIdx) => {
          doc.text(
            row.values[sz] ?? '—',
            rx + pomW + sIdx * szColW + szColW / 2,
            ry,
            { align: 'center' },
          );
        });
      });

      drawPageFooter(doc, `TECH PACK · ${g.techPack.styleCode}`, pageNum, totalPages);
    });

    onProgress?.(98);
    doc.save('stress-Manufacturer-Production-TechPack.pdf');
    onProgress?.(100);
    return;
  }

  // ============================================================================
  // MODE === 'moodboard' -> CREATIVE DIRECTION & DESIGN RATIONALE MOOD BOARD PDF
  // (Includes Inspiration Sample Archive & Creative Rationale)
  // ============================================================================
  const moodAssets = new Map<
    string,
    { main: LoadedImage | null; samples: (LoadedImage | null)[] }
  >();

  for (const g of garments) {
    const main = await loadImageJpeg(g.image, 480);
    const samples: (LoadedImage | null)[] = [];
    for (const s of g.sampleInspirations.slice(0, 2)) {
      samples.push(await loadImageJpeg(s.image, 320));
    }
    moodAssets.set(g.id, { main, samples });
    loadedCount += 1;
    onProgress?.(Math.min(75, Math.round((loadedCount / Math.max(1, totalSteps)) * 70) + 5));
  }

  const editorialAssets: (LoadedImage | null)[] = [];
  for (const plate of EDITORIAL_MOOD_PLATES) {
    editorialAssets.push(await loadImageJpeg(plate.image, 360));
    loadedCount += 1;
    onProgress?.(Math.min(82, Math.round((loadedCount / Math.max(1, totalSteps)) * 70) + 5));
  }

  const designPages = Math.ceil(garments.length / 2);
  const totalPages = 1 + designPages;

  paintBonePage(doc);
  drawStressWordmarkPdf(doc, 14, 21, 28);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 82, 72);
  doc.text('CREATIVE DIRECTION MOOD BOARD & DESIGN ARCHIVE', 283, 15, { align: 'right' });
  doc.text(scopeLabel.toUpperCase(), 283, 20, { align: 'right' });
  doc.setDrawColor(26, 21, 18);
  doc.line(14, 26, 283, 26);

  doc.setFont('times', 'normal');
  doc.setFontSize(22);
  doc.setTextColor(26, 21, 18);
  doc.text(`"${BRAND.slogan}"`, 14, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(74, 67, 59);
  const introLines = doc.splitTextToSize(
    `${BRAND.subSlogan} Every silhouette begins with raw textile samples and monochrome archival plates—edited down to architectural proportion, six mineral earth tones, and subtle collar, cuff, and leather wordmarks.`,
    170,
  );
  doc.text(introLines, 14, 45);

  BRAND_PIGMENTS.forEach((p, idx) => {
    const sx = 14 + idx * 45;
    const [r, g, b] = hexToRgb(p.hex);
    doc.setFillColor(r, g, b);
    doc.rect(sx, 62, 41, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(26, 21, 18);
    doc.text(p.name, sx, 83);
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(90, 82, 72);
    doc.text(`${p.hex} · ${p.pantoneTcx}`, sx, 87);
  });

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(31, 61, 43);
  doc.text('ATMOSPHERE & ARCHIVAL INSPIRATION PLATES', 14, 98);

  EDITORIAL_MOOD_PLATES.forEach((plate, idx) => {
    const px = 14 + idx * 68;
    doc.setFillColor(250, 247, 242);
    doc.setDrawColor(215, 208, 196);
    doc.rect(px, 102, 64, 58, 'FD');
    drawFittedImage(doc, editorialAssets[idx] ?? null, px + 2, 104, 60, 40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(26, 21, 18);
    doc.text(plate.title, px + 2, 148.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(74, 67, 59);
    const nLines = doc.splitTextToSize(plate.note, 60);
    doc.text(nLines.slice(0, 2), px + 2, 153);
  });

  COLLECTIONS.forEach((c, idx) => {
    const cx = 14 + idx * 91;
    doc.setFillColor(239, 233, 220);
    doc.rect(cx, 166, 87, 27, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(31, 61, 43);
    doc.text(`COLLECTION ${c.number}`, cx + 3, 171.5);
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(26, 21, 18);
    doc.text(c.name, cx + 3, 177.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.6);
    doc.setTextColor(74, 67, 59);
    const lines = doc.splitTextToSize(c.narrative, 81);
    doc.text(lines.slice(0, 3), cx + 3, 182.5);
  });

  drawPageFooter(doc, 'CREATIVE DIRECTION COVER BOARD', 1, totalPages);

  for (let i = 0; i < garments.length; i += 2) {
    doc.addPage();
    paintBonePage(doc);
    const pair = garments.slice(i, i + 2);

    pair.forEach((g, localIdx) => {
      const bx = 14 + localIdx * 137;
      const bw = 131;
      const collection = COLLECTIONS.find((c) => c.id === g.collectionId);
      const assets = moodAssets.get(g.id);

      doc.setFillColor(250, 247, 242);
      doc.setDrawColor(210, 202, 188);
      doc.rect(bx, 14, bw, 179, 'FD');

      doc.setFont('courier', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(31, 61, 43);
      doc.text(
        `LOOK ${g.number} · ${collection?.name.toUpperCase() ?? ''} · ${g.category.toUpperCase()}`,
        bx + 4,
        21,
      );

      doc.setFont('times', 'normal');
      doc.setFontSize(14);
      doc.setTextColor(26, 21, 18);
      const titleLines = doc.splitTextToSize(g.name, bw - 8);
      doc.text(titleLines.slice(0, 2), bx + 4, 28);

      drawFittedImage(doc, assets?.main ?? null, bx + 4, 36, 76, 98);

      doc.setFont('courier', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(90, 82, 72);
      doc.text('SAMPLE REFS', bx + 84, 39);
      (assets?.samples ?? []).forEach((sImg, sIdx) => {
        const sy = 42 + sIdx * 47;
        drawFittedImage(doc, sImg, bx + 84, sy, 42, 34);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.8);
        doc.setTextColor(74, 67, 59);
        const sLbl = doc.splitTextToSize(
          g.sampleInspirations[sIdx]?.label ?? 'Sample Ref',
          42,
        );
        doc.text(sLbl.slice(0, 2), bx + 84, sy + 37.5);
      });

      doc.setDrawColor(220, 212, 200);
      doc.line(bx + 4, 138, bx + bw - 4, 138);

      doc.setFont('courier', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(31, 61, 43);
      doc.text('CREATIVE DIRECTOR DESIGN NOTE', bx + 4, 143.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.4);
      doc.setTextColor(58, 52, 45);
      const mLines = doc.splitTextToSize(`${g.moodBoardNote} ${g.redesignNote}`, bw - 8);
      doc.text(mLines.slice(0, 4), bx + 4, 148.5);

      doc.setFont('courier', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(26, 21, 18);
      doc.text('FABRIC & WASH SPEC:', bx + 4, 169);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      const fLines = doc.splitTextToSize(`${g.fabricSpec} · ${g.washNote}`, bw - 8);
      doc.text(fLines.slice(0, 2), bx + 4, 173.5);

      doc.setFont('courier', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(31, 61, 43);
      doc.text(
        `SUBTLE LOGO PLACEMENT: ${g.primaryLogo.label.toUpperCase()} (${g.primaryLogo.physicalSpec})`,
        bx + 4,
        186.5,
      );
    });

    drawPageFooter(doc, 'CREATIVE DIRECTION DESIGN RATIONALE', Math.floor(i / 2) + 2, totalPages);
  }

  onProgress?.(98);
  doc.save('stress-Creative-Direction-MoodBoard.pdf');
  onProgress?.(100);
}
