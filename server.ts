import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const FREE_SHIPPING_THRESHOLD = 1000;
const FLAT_COURIER_FEE = 45;
const DATA_DIR = path.resolve(process.cwd(), '.data');
const PREORDERS_FILE = path.join(DATA_DIR, 'preorders.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

type PaymentMethod = 'invoice' | 'wire' | 'cod';

interface LineItemPayload {
  garmentId: string;
  styleCode: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  image: string;
  customOverrides?: Record<string, unknown>;
}

interface StoredPreOrder {
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
  paymentMethod: PaymentMethod;
  items: LineItemPayload[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

interface SubscriberRecord {
  email: string;
  subscribedAt: string;
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonArray<T>(filePath: string): T[] {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeJsonArray<T>(filePath: string, data: T[]): void {
  ensureDataDir();
  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpPath, filePath);
}

function generateOrderId(existing: StoredPreOrder[]): string {
  const existingIds = new Set(existing.map((o) => o.orderId));
  for (let i = 0; i < 20; i += 1) {
    const suffix = crypto.randomInt(1000, 9999);
    const candidate = `STR-26-${suffix}`;
    if (!existingIds.has(candidate)) {
      return candidate;
    }
  }
  return `STR-26-${Date.now().toString().slice(-5)}`;
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, brand: 'stress', batch: 'AW26 Batch 01' });
  });

  app.post('/api/preorders', (req: Request, res: Response) => {
    const body = req.body ?? {};
    const customer = body.customer ?? {};
    const rawItems = Array.isArray(body.items) ? body.items : [];
    const paymentMethod: PaymentMethod =
      body.paymentMethod === 'wire' || body.paymentMethod === 'cod'
        ? body.paymentMethod
        : 'invoice';

    const fullName = String(customer.fullName ?? '').trim();
    const email = String(customer.email ?? '').trim().toLowerCase();
    const phone = String(customer.phone ?? '').trim();
    const address = String(customer.address ?? '').trim();
    const city = String(customer.city ?? '').trim();
    const country = String(customer.country ?? '').trim();
    const postalCode = String(customer.postalCode ?? '').trim();
    const note = String(customer.note ?? '').trim();

    if (!fullName || !email || !phone || !address || !city || !country || !postalCode) {
      res.status(400).json({ error: 'All shipping and contact fields are required.' });
      return;
    }

    if (rawItems.length === 0) {
      res.status(400).json({ error: 'Cannot place an empty pre-order.' });
      return;
    }

    const items: LineItemPayload[] = [];
    for (const item of rawItems) {
      const qty = Math.max(1, Math.min(20, Math.floor(Number(item?.quantity) || 1)));
      const unitPrice = Math.max(1, Math.round(Number(item?.unitPrice) || 0));
      const garmentId = String(item?.garmentId ?? '').trim();
      const name = String(item?.name ?? '').trim();
      const size = String(item?.size ?? 'OS').trim();
      if (!garmentId || !name || unitPrice <= 0) {
        res.status(400).json({ error: 'Invalid pre-order line item.' });
        return;
      }
      items.push({
        garmentId,
        styleCode: String(item?.styleCode ?? 'STR-AW26').trim(),
        name,
        size,
        quantity: qty,
        unitPrice,
        image: String(item?.image ?? '').trim(),
        customOverrides:
          item?.customOverrides && typeof item.customOverrides === 'object'
            ? (item.customOverrides as Record<string, unknown>)
            : undefined,
      });
    }

    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_COURIER_FEE;
    const total = subtotal + shippingCost;

    const existing = readJsonArray<StoredPreOrder>(PREORDERS_FILE);
    const order: StoredPreOrder = {
      orderId: generateOrderId(existing),
      createdAt: new Date().toISOString(),
      batch: 'AW26 · Batch 01',
      estimatedDispatch: 'December 15 – December 30, 2026',
      status: 'Allocation Confirmed — Queued for AW26 Batch 01',
      statusStep: 1,
      customer: {
        fullName,
        email,
        phone,
        address,
        city,
        country,
        postalCode,
        note: note || undefined,
      },
      paymentMethod,
      items,
      subtotal,
      shippingCost,
      total,
    };

    existing.unshift(order);
    writeJsonArray(PREORDERS_FILE, existing);

    res.status(201).json({ order });
  });

  app.get('/api/preorders/lookup', (req: Request, res: Response) => {
    const orderIdQuery = String(req.query.orderId ?? '').trim().toUpperCase();
    const emailQuery = String(req.query.email ?? '').trim().toLowerCase();

    if (!orderIdQuery && !emailQuery) {
      res.status(400).json({ error: 'Enter an Order ID or Email address to look up.' });
      return;
    }

    const orders = readJsonArray<StoredPreOrder>(PREORDERS_FILE);
    const matches = orders.filter((o) => {
      if (orderIdQuery && emailQuery) {
        return (
          o.orderId.toUpperCase() === orderIdQuery &&
          o.customer.email.toLowerCase() === emailQuery
        );
      }
      if (orderIdQuery) {
        return o.orderId.toUpperCase() === orderIdQuery;
      }
      return o.customer.email.toLowerCase() === emailQuery;
    });

    res.json({ orders: matches });
  });

  app.post('/api/newsletter', (req: Request, res: Response) => {
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const subscribers = readJsonArray<SubscriberRecord>(SUBSCRIBERS_FILE);
    const alreadyExists = subscribers.some((s) => s.email === email);
    if (!alreadyExists) {
      subscribers.unshift({ email, subscribedAt: new Date().toISOString() });
      writeJsonArray(SUBSCRIBERS_FILE, subscribers);
    }

    res.status(201).json({ ok: true, alreadyExists });
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`stress flagship server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
