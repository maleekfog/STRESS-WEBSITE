import { CollectionMeta, DyeId, LogoFinish } from '../types/garment';

export const BRAND = {
  name: 'stress',
  slogan: 'Composed Under Pressure.',
  subSlogan:
    'Enigmatic, house-distressed urban armor cut from shadowed mineral earth and heavyweight textiles—quiet tension worn without explanation.',
  logoAsset: '/assets/aistudio/stress-logo_2fa94d33.svg',
  emblemLogoAsset: '/src/assets/images/stress_label_emblem_logo_1795120933538.jpg',
  edition: 'AW26 · 3 Collections · 70 Original Designs',
  freeShippingThreshold: 1000,
} as const;

export const EMBLEM_MEANING = {
  title: 'The Fault-Line Seal',
  origin: 'Extracted from Look 57 Collar Label · Adopted House Cipher',
  manifesto:
    'A nameless tectonic sign borne on darkened Forest Pine labels, monochrome xerox chest plates, heavyweight crew hosiery, and ribbed undergarments—concealing explanation behind sharp silent geometry.',
  pillars: [
    {
      code: '01 · FRACTURED ASCENT',
      heading: 'Force Deflected Under Weight',
      meaning:
        'The continuous upper path climbs to a hairline apex before deflecting twice in angular lightning—mapping how stress bends beneath crushing load without fracturing apart.',
    },
    {
      code: '02 · DETACHED THRESHOLD',
      heading: 'The Unspoken Gap',
      meaning:
        'A horizontal bar sits severed on the lower left, refusing to close into a predictable triangle. The missing join embodies mystery: confidence anchored in what stays concealed.',
    },
    {
      code: '03 · COVERT DEPLOYMENT',
      heading: 'Labels, Prints, Socks & Boxers',
      meaning:
        'Stamped onto every neck and waistband damask seal (LBL-01), discharged onto selected dark tees and hoodies, jacquard-knitted on crew socks, and woven along contoured boxer bands.',
    },
  ],
} as const;

export interface PigmentSwatch {
  id: DyeId;
  letter: string;
  name: string;
  hex: string;
  pantoneTcx: string;
  dyeChemistry: string;
  role: string;
  cssFilter: string;
}

export const BRAND_PIGMENTS: PigmentSwatch[] = [
  {
    id: 'forest-pine',
    letter: 's',
    name: 'Forest Pine',
    hex: '#1F3D2B',
    pantoneTcx: '19-5918 TCX',
    dyeChemistry: 'Reactive Mineral Pigment Bath (60°C) · Enzyme Soften',
    role: 'Deep pigment overdye, corduroy collars & woven neck tabs',
    cssFilter: 'sepia(0.32) hue-rotate(92deg) saturate(1.18) brightness(0.86) contrast(1.06)',
  },
  {
    id: 'moss-olive',
    letter: 't',
    name: 'Moss Olive',
    hex: '#4E6236',
    pantoneTcx: '18-0430 TCX',
    dyeChemistry: 'Vegetable-Tannin Drum Dye & Reactive Cotton Wash',
    role: 'Heavy utility canvas, luggage hide & tactical vest panels',
    cssFilter: 'sepia(0.36) hue-rotate(48deg) saturate(1.14) brightness(0.92) contrast(1.04)',
  },
  {
    id: 'lichen-sage',
    letter: 'r',
    name: 'Lichen Sage',
    hex: '#7F7F45',
    pantoneTcx: '17-0625 TCX',
    dyeChemistry: 'Mineral Earth Spray + Sun-Cured Potassium Fade',
    role: 'Acid-washed boxy jersey, denim dirty tint & marled wool knit',
    cssFilter: 'sepia(0.38) hue-rotate(24deg) saturate(0.95) brightness(0.97) contrast(1.03)',
  },
  {
    id: 'raw-ochre',
    letter: 'e',
    name: 'Raw Ochre',
    hex: '#A98B5E',
    pantoneTcx: '16-1126 TCX',
    dyeChemistry: 'Silica Stone Wash + Mineral Pigment Exhaust Dye',
    role: '14oz duck canvas outerwear, double-knee pants & heavy terry',
    cssFilter: 'sepia(0.45) hue-rotate(-6deg) saturate(0.92) brightness(0.98) contrast(1.02)',
  },
  {
    id: 'umber-espresso',
    letter: 's',
    name: 'Umber Espresso',
    hex: '#5B3A29',
    pantoneTcx: '19-1116 TCX',
    dyeChemistry: 'Yarn-Dyed Sulphur Roast & Edge-Burnished Calfskin',
    role: 'Plaid flannel sleeves, rugby stripes, leather tags & mud mesh',
    cssFilter: 'sepia(0.46) hue-rotate(-22deg) saturate(1.08) brightness(0.88) contrast(1.06)',
  },
  {
    id: 'obsidian',
    letter: 's',
    name: 'Obsidian Charcoal',
    hex: '#1A1512',
    pantoneTcx: '19-0303 TCX',
    dyeChemistry: 'Carbon Pigment Immersion · Matte Cold Cure',
    role: 'Ringer trim, contrast overlock seams, suede cages & ink',
    cssFilter: 'grayscale(0.75) brightness(0.84) contrast(1.14)',
  },
];

export const COLLECTIONS: CollectionMeta[] = [
  {
    id: 'mineral-foundation',
    number: '01',
    name: 'Mineral Foundation',
    subtitle: 'Core Jersey, Fleece, Intimates & Selvedge Silhouettes',
    season: 'AW26 · Drop 01',
    narrative:
      'Establishes the enigmatic vocabulary of stress: heavyweight box-cut jersey, cipher-printed tees & hoodies, woven-seal boxer briefs, and selvedge work trousers steeped in our six mineral pigments.',
    fabricFocus: '215–520 GSM Combed Cotton, 14oz Japanese Selvedge, 13.5oz Duck Canvas',
  },
  {
    id: 'workwear-knits',
    number: '02',
    name: 'Workwear & Raw Knits',
    subtitle: 'Architectural Outerwear, Field Overshirts & Open-Gauge Knitwear',
    season: 'AW26 · Drop 02',
    narrative:
      'Translates weathered studio coats, M-65 field jackets, cropped earth-plaid overshirts, utility blazers, and swirl merino sweaters into nocturnal luxury silhouettes signed with covert Fault-Line seals.',
    fabricFocus: '14oz Sun-Washed Duck Canvas, 540 GSM Loopback, 5-Gauge Cotton-Linen, 420 GSM Slub Merino',
  },
  {
    id: 'armor-hardware',
    number: '03',
    name: 'Urban Armor & Hardware',
    subtitle: 'Shearling Flight Shells, Camo Cargo, Cipher Hosiery & Engineer Boots',
    season: 'AW26 · Drop 03',
    narrative:
      'Completes the mysterious uniform from crown to outsole: abraded horsehide jackets, overdyed camo parkas, Fault-Line jacquard crew socks, armor clogs, and harness & engineer boots.',
    fabricFocus: 'Full-Grain Horsehide & Calfskin, 7-Gauge Merino Wool, Ripstop Camo & Molded TPU',
  },
];

export const EDITORIAL_MOOD_PLATES = [
  {
    image: '/assets/aistudio/7294a2026c89e3337b0dc0e0e3806c06_946d56ef.jpg',
    title: 'Subterranean Poise (Photo Ref)',
    note: 'Monochrome upward perspective—informs stark contrast ratios and calm defiance under pressure.',
  },
  {
    image: '/assets/aistudio/download__1__0828e492.png',
    title: 'Woodcut Silhouette Study',
    note: 'High-grain ink hatching guiding discharge chest prints and brutalist shadow density.',
  },
  {
    image: '/assets/aistudio/56ef62b373cb5a26efc6b57b22438464_6e09fdf6.jpg',
    title: 'Stipple Crown Study',
    note: 'Raw xerox grain translating into frayed edge abrasion and textured 5-gauge open-knit surfaces.',
  },
  {
    image: '/assets/aistudio/085c73575c3c30adbb13cd68147efecd_eba7ca8d.jpg',
    title: 'Terrain Sole Reference',
    note: 'Aggressively lugged trail rubber geometry paired against refined obsidian suede panels.',
  },
];

export const FACTORY_TRIM_STANDARDS = [
  {
    code: 'LBL-01',
    title: 'Fault-Line Seal Woven Label (Mandatory All SKUs)',
    spec: 'Every garment carries the Forest Pine (#1F3D2B) 1200-denier damask neck/waist seal weaving the fractured Fault-Line cipher mark beside micro Bodoni "stress" lettering; 2mm center-fold tabs.',
  },
  {
    code: 'GRP-02',
    title: 'Cryptic Cipher Graphic & Micro-Stitch',
    spec: 'Selected graphic silhouettes (STR-001, STR-004, STR-036) screen-print the 180–220mm Fault-Line emblem in matte Obsidian/Warm Bone halftone ink; tailoring & knitwear carry 24–30mm tonal stitches.',
  },
  {
    code: 'HSR-03',
    title: 'Socks Jacquard & Boxer Waistband Repeat',
    spec: 'Crew socks (STR-043, STR-056) lock-knit the Fault-Line mark at calf height plus folded cuff seal; boxer briefs (STR-051, STR-052) weave alternating Fault-Line emblem + serif "stress" on 35–38mm bands with lower-thigh ink stamp.',
  },
  {
    code: 'QC-04',
    title: 'Dye Lot & Shrinkage Tolerance',
    spec: 'Pre-shrunk enzyme wash required prior to cutting or garment-dyed with 6% pattern allowance. Spectrophotometer Delta-E ≤ 1.2 against Pantone TCX master standard.',
  },
  {
    code: 'QC-05',
    title: 'Universal House Distressing Mandate (Mandatory All 70 SKUs)',
    spec: 'ZERO untreated or un-weathered units permitted. Every single stress product—outerwear, knits, tees, trousers, undergarments, hosiery, bags, headwear, and footwear—must undergo controlled pumice seam frosting, stone-tumbled collar/hem nicking, enzyme fade, or hand-burnished hide wear per SKU distressingSop.',
  },
];

export const DYE_OPTIONS: { id: DyeId; label: string; hex: string; filter: string }[] = [
  { id: 'original', label: 'Curated Redesign', hex: '#EFE9DC', filter: '' },
  ...BRAND_PIGMENTS.map((p) => ({
    id: p.id,
    label: p.name,
    hex: p.hex,
    filter: p.cssFilter,
  })),
];

export const LOGO_FINISH_OPTIONS: { id: LogoFinish; label: string; swatch: string }[] = [
  { id: 'signature', label: '6-Tone Serif', swatch: '#4E6236' },
  { id: 'obsidian', label: 'Obsidian Ink', swatch: '#1A1512' },
  { id: 'bone', label: 'Warm Bone', swatch: '#F5F0E6' },
  { id: 'pine', label: 'Forest Pine', swatch: '#1F3D2B' },
  { id: 'ochre', label: 'Raw Ochre', swatch: '#A98B5E' },
];

export const PLACEMENT_PRINCIPLES = [
  {
    index: '01',
    title: 'Universal Fault-Line Label Standard',
    detail:
      'Every external third-party tag is stripped across all 70 pieces and replaced by our 1200-denier Forest Pine damask Fault-Line Seal label inside collars, waistbands, and boot tongues.',
  },
  {
    index: '02',
    title: 'Covert Graphic, Sock & Boxer Encoding',
    detail:
      'Rather than literal slogans, the fractured Fault-Line cipher appears as shadowed xerox plates on tees & hoodies, float-free jacquard knits on crew socks, and woven repeats & thigh prints on briefs.',
  },
  {
    index: '03',
    title: 'Nocturnal Architectural Lookbook',
    detail:
      'Submitted inspirations and street frames converge across 70 original AW26 silhouettes harmonized under six Pantone TCX earth pigments and photographed candidly in steel doorways, stairwells, and dusk walls.',
  },
];
