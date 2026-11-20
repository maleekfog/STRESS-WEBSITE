export type CollectionId =
  | 'mineral-foundation'
  | 'workwear-knits'
  | 'armor-hardware';

export type GarmentCategory =
  | 'Tees & Tanks'
  | 'Polos & Hoodies'
  | 'Outerwear & Knits'
  | 'Bottoms'
  | 'Bags & Footwear'
  | 'Headwear & Accessories';

export type DyeId =
  | 'original'
  | 'forest-pine'
  | 'moss-olive'
  | 'lichen-sage'
  | 'raw-ochre'
  | 'umber-espresso'
  | 'obsidian';

export type LogoFinish = 'signature' | 'obsidian' | 'bone' | 'pine' | 'ochre';

export type PlacementKind =
  | 'woven-neck'
  | 'tonal-embroidery'
  | 'woven-flag'
  | 'archive-stencil'
  | 'debossed-leather';

export interface CollectionMeta {
  id: CollectionId;
  number: string;
  name: string;
  subtitle: string;
  season: string;
  narrative: string;
  fabricFocus: string;
}

export interface SampleInspiration {
  image: string;
  label: string;
  takeaway: string;
}

export interface LogoMarkSpec {
  kind: PlacementKind;
  label: string;
  x: number;
  y: number;
  widthPct: number;
  rotate?: number;
  finish: LogoFinish;
  opacity: number;
  physicalSpec: string;
}

export interface SizeGradingRow {
  pointOfMeasure: string;
  values: Record<string, string>;
}

export interface ManufacturerTechPack {
  styleCode: string;
  fabricType: string;
  composition: string;
  gsmOrWeight: string;
  knitOrWeave: string;
  shrinkageSpec: string;
  pantoneRef: string;
  dyeFormula: string;
  distressingSop: string;
  stitchSpec: string;
  seamFinish: string;
  trimsBom: string[];
  logoTechnique: string;
  logoDimensionsMm: string;
  logoCoordinateOffsetMm: string;
  sizeGrading: SizeGradingRow[];
}

export type GarmentAngle = 'front' | 'back' | 'left' | 'right';

export interface Garment {
  id: string;
  number: string;
  collectionId: CollectionId;
  name: string;
  category: GarmentCategory;
  price: number;
  sizes: string[];
  image: string;
  turnaroundImage: string;
  modelImage: string;
  outfitItemIds: string[];
  sampleInspirations: SampleInspiration[];
  fabricSpec: string;
  washNote: string;
  redesignNote: string;
  moodBoardNote: string;
  primaryLogo: LogoMarkSpec;
  techPack: ManufacturerTechPack;
}

export interface CustomGarmentOverrides {
  dye: DyeId;
  finish: LogoFinish;
  opacity: number;
  logoX: number;
  logoY: number;
  logoScale: number;
  showExtraMark?: boolean;
}

export interface BagItem {
  key: string;
  garmentId: string;
  size: string;
  quantity: number;
  customOverrides?: CustomGarmentOverrides;
}

export interface JournalArticle {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  featuredGarmentId: string;
  secondaryGarmentId: string;
  excerpt: string;
  sections: {
    heading: string;
    body: string[];
    pullQuote?: string;
  }[];
}

export type PreOrderPaymentMethod = 'invoice' | 'wire' | 'cod';

export interface PreOrderLineItem {
  garmentId: string;
  styleCode: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  image: string;
  customOverrides?: CustomGarmentOverrides;
}

export interface PreOrderRecord {
  orderId: string;
  createdAt: string;
  batch: string;
  estimatedDispatch: string;
  status: string;
  statusStep: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    note?: string;
  };
  paymentMethod: PreOrderPaymentMethod;
  items: PreOrderLineItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

