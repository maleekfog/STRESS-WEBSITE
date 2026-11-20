import React, { useState } from 'react';
import { CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import { BRAND } from '../data/brand';
import {
  BagItem,
  Garment,
  PreOrderPaymentMethod,
  PreOrderRecord,
} from '../types/garment';
import { RedesignedGarment } from './RedesignedGarment';

interface BagDrawerProps {
  isOpen: boolean;
  items: BagItem[];
  garments: Garment[];
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearBag: () => void;
  onOrderCreated: (order: PreOrderRecord) => void;
  onOpenOrderLookup: (orderId?: string) => void;
}

const PAYMENT_OPTIONS: {
  id: PreOrderPaymentMethod;
  title: string;
  desc: string;
}[] = [
  {
    id: 'invoice',
    title: 'Studio Invoice Upon Dispatch',
    desc: 'Reserve your AW26 Batch 01 allocation now; settle your private studio invoice prior to courier dispatch.',
  },
  {
    id: 'wire',
    title: 'Direct Bank Wire Reservation',
    desc: 'Receive IBAN / ACH wire instructions with your numbered allocation receipt.',
  },
  {
    id: 'cod',
    title: 'Courier Card / Cash on Delivery',
    desc: 'Settle via courier mobile terminal upon insured doorstep handoff.',
  },
];

export const BagDrawer: React.FC<BagDrawerProps> = ({
  isOpen,
  items,
  garments,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearBag,
  onOrderCreated,
  onOpenOrderLookup,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [confirmedOrder, setConfirmedOrder] = useState<PreOrderRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PreOrderPaymentMethod>('invoice');
  const [acceptedPreOrderTerms, setAcceptedPreOrderTerms] = useState(true);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    note: '',
  });

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const garment = garments.find((g) => g.id === item.garmentId);
    return sum + (garment ? garment.price * item.quantity : 0);
  }, 0);

  const freeShippingRemaining = Math.max(0, BRAND.freeShippingThreshold - subtotal);
  const shippingCost = subtotal === 0 || freeShippingRemaining === 0 ? 0 : 45;
  const total = subtotal + shippingCost;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedPreOrderTerms || submitting) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payloadItems = items
        .map((item) => {
          const garment = garments.find((g) => g.id === item.garmentId);
          if (!garment) return null;
          return {
            garmentId: garment.id,
            styleCode: garment.techPack.styleCode,
            name: garment.name,
            size: item.size,
            quantity: item.quantity,
            unitPrice: garment.price,
            image: garment.image,
            customOverrides: item.customOverrides,
          };
        })
        .filter((i): i is NonNullable<typeof i> => Boolean(i));

      const res = await fetch('/api/preorders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          paymentMethod,
          items: payloadItems,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.order) {
        throw new Error(data?.error || 'Could not confirm pre-order allocation.');
      }

      const created = data.order as PreOrderRecord;
      setConfirmedOrder(created);
      onOrderCreated(created);
      onClearBag();
      setStep('confirmed');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to submit reservation right now.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (step === 'confirmed') {
      setStep('bag');
      setConfirmedOrder(null);
    }
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1A1512]/55 backdrop-blur-[2px] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Pre-Order Shopping Bag"
      onClick={handleClose}
    >
      <aside
        className="w-full max-w-md bg-[#FAF7F2] h-full border-l border-[#1A1512]/15 flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#1A1512]/10 flex items-center justify-between bg-[#F5F0E6]">
          <div>
            <h2 className="font-brand-serif text-xl text-[#1A1512]">
              {step === 'bag'
                ? 'Pre-Order Bag'
                : step === 'checkout'
                  ? 'Allocation & Shipping'
                  : 'Allocation Confirmed'}
            </h2>
            {step === 'bag' && (
              <p className="text-xs text-[#5A5248] tabular-nums">
                {items.reduce((acc, i) => acc + i.quantity, 0)} piece(s) · AW26 Batch 01
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close bag"
            className="w-10 h-10 border border-[#1A1512]/15 flex items-center justify-center hover:bg-[#EFE9DC] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {step === 'confirmed' && confirmedOrder ? (
            <div className="py-6 space-y-6">
              <div className="w-11 h-11 bg-[#1F3D2B] text-[#F5F0E6] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#1F3D2B]">
                  Order {confirmedOrder.orderId} · {confirmedOrder.batch}
                </p>
                <h3 className="font-brand-serif text-2xl text-[#1A1512]">
                  Composed Under Pressure.
                </h3>
                <p className="text-sm leading-relaxed text-[#4A433B]">
                  Thank you, {confirmedOrder.customer.fullName}. Your house-distressed AW26 pieces
                  are reserved for production. Estimated courier dispatch:{' '}
                  <strong className="text-[#1A1512]">{confirmedOrder.estimatedDispatch}</strong>.
                </p>
              </div>

              {/* Confirmed Order Receipt Summary */}
              <div className="p-4 bg-[#EFE9DC]/75 border border-[#1A1512]/10 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5A5248]">Allocation Code</span>
                  <span className="font-mono font-semibold text-[#1A1512]">
                    {confirmedOrder.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A5248]">Destination</span>
                  <span className="text-right text-[#1A1512]">
                    {confirmedOrder.customer.city}, {confirmedOrder.customer.country}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A5248]">Reserved Items</span>
                  <span className="font-mono text-[#1A1512] tabular-nums">
                    {confirmedOrder.items.reduce((s, i) => s + i.quantity, 0)} pcs
                  </span>
                </div>
                <div className="pt-2 border-t border-[#1A1512]/10 flex justify-between font-semibold text-sm text-[#1A1512]">
                  <span>Total Allocation</span>
                  <span className="font-mono tabular-nums">
                    ${confirmedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const id = confirmedOrder.orderId;
                    handleClose();
                    onOpenOrderLookup(id);
                  }}
                  className="w-full h-11 bg-[#1F3D2B] text-[#F5F0E6] text-xs font-medium uppercase tracking-[0.1em] hover:bg-[#162D1F] transition-colors cursor-pointer"
                >
                  View Pre-Order Status
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full h-11 border border-[#1A1512]/20 text-[#1A1512] text-xs font-medium uppercase tracking-[0.1em] hover:bg-[#EFE9DC] transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : step === 'checkout' ? (
            <form id="stress-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-5">
              <div className="p-4 bg-[#EFE9DC] border border-[#1A1512]/10 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#5A5248]">
                  <span>AW26 Batch 01 Subtotal</span>
                  <span className="font-mono tabular-nums">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#5A5248]">
                  <span>Insured Private Courier</span>
                  <span className="font-mono tabular-nums">
                    {shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#5A5248]">
                  <span>Est. Dispatch</span>
                  <span className="font-mono text-[#1F3D2B]">Dec 15–30, 2026</span>
                </div>
                <div className="pt-2 mt-2 border-t border-[#1A1512]/10 flex justify-between font-semibold text-sm text-[#1A1512]">
                  <span>Total Allocation</span>
                  <span className="font-mono tabular-nums">${total.toLocaleString()}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 border border-[#8B2E22]/30 bg-[#8B2E22]/10 text-xs text-[#6B1F16]">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5A5248] mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Jordan Mercer"
                    className="w-full h-10 px-3 text-sm bg-[#F5F0E6] border border-[#1A1512]/20 focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5A5248] mb-1">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jordan@studio.com"
                      className="w-full h-10 px-3 text-sm bg-[#F5F0E6] border border-[#1A1512]/20 focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5A5248] mb-1">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 212 555 0148"
                      className="w-full h-10 px-3 text-sm bg-[#F5F0E6] border border-[#1A1512]/20 focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5A5248] mb-1">
                    Street Address
                  </label>
                  <input
                    required
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="412 Mercer St, Apt 4B"
                    className="w-full h-10 px-3 text-sm bg-[#F5F0E6] border border-[#1A1512]/20 focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5A5248] mb-1">
                      City
                    </label>
                    <input
                      required
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="New York"
                      className="w-full h-10 px-3 text-sm bg-[#F5F0E6] border border-[#1A1512]/20 focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5A5248] mb-1">
                      Postal Code
                    </label>
                    <input
                      required
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      placeholder="10013"
                      className="w-full h-10 px-3 text-sm bg-[#F5F0E6] border border-[#1A1512]/20 focus:outline-none focus:border-[#1F3D2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5A5248] mb-1">
                    Country / Region
                  </label>
                  <input
                    required
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="United States"
                    className="w-full h-10 px-3 text-sm bg-[#F5F0E6] border border-[#1A1512]/20 focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>

                {/* Settlement Preference */}
                <div className="pt-2 space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#5A5248]">
                    Allocation Settlement Method
                  </div>
                  <div className="space-y-2">
                    {PAYMENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`w-full p-3 border text-left transition-colors cursor-pointer ${
                          paymentMethod === opt.id
                            ? 'border-[#1F3D2B] bg-[#EFE9DC]/80'
                            : 'border-[#1A1512]/15 bg-[#F5F0E6] hover:border-[#1A1512]/40'
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#1A1512]">{opt.title}</div>
                        <p className="mt-0.5 text-[11px] text-[#5A5248] leading-snug">
                          {opt.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5A5248] mb-1">
                    Delivery / Sizing Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Concierge delivery notes..."
                    className="w-full h-10 px-3 text-sm bg-[#F5F0E6] border border-[#1A1512]/20 focus:outline-none focus:border-[#1F3D2B]"
                  />
                </div>

                <label className="flex items-start gap-2.5 pt-2 text-xs text-[#4A433B] cursor-pointer">
                  <input
                    required
                    type="checkbox"
                    checked={acceptedPreOrderTerms}
                    onChange={(e) => setAcceptedPreOrderTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#1F3D2B] cursor-pointer"
                  />
                  <span>
                    I understand each AW26 piece is house-distressed to order and dispatches within
                    4–6 weeks (Dec 15–30, 2026).
                  </span>
                </label>
              </div>
            </form>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <p className="font-brand-serif text-xl text-[#1A1512]">Your bag is empty.</p>
              <p className="text-xs text-[#5A5248] max-w-[30ch] mx-auto leading-relaxed">
                Select any numbered silhouette from the AW26 collection to reserve your pre-order
                allocation.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onOpenOrderLookup();
                }}
                className="text-xs font-mono text-[#1F3D2B] underline underline-offset-4 cursor-pointer"
              >
                Track Existing Pre-Order →
              </button>
            </div>
          ) : (
            <>
              <div className="p-3.5 bg-[#EFE9DC] border border-[#1A1512]/10 text-xs text-[#4A433B] space-y-1">
                {freeShippingRemaining === 0 ? (
                  <div className="font-medium text-[#1F3D2B]">
                    Complimentary insured courier unlocked.
                  </div>
                ) : (
                  <div className="tabular-nums">
                    Add <strong>${freeShippingRemaining.toLocaleString()}</strong> more for
                    complimentary insured private courier.
                  </div>
                )}
                <div className="text-[11px] font-mono text-[#5A5248]">
                  AW26 Batch 01 · Est. Dispatch Dec 15–30, 2026
                </div>
              </div>

              <div className="divide-y divide-[#1A1512]/10">
                {items.map((item) => {
                  const garment = garments.find((g) => g.id === item.garmentId);
                  if (!garment) return null;

                  return (
                    <div key={item.key} className="py-4 flex gap-4">
                      <div className="w-20 h-24 border border-[#1A1512]/10 overflow-hidden shrink-0 bg-[#EFE9DC]">
                        <RedesignedGarment
                          garment={garment}
                          mode="redesigned"
                          overrides={item.customOverrides}
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-medium text-[#1A1512] truncate">
                              {garment.name}
                            </h3>
                            <span className="text-sm font-mono font-medium text-[#1A1512] tabular-nums shrink-0">
                              ${(garment.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                          <div className="mt-0.5 text-xs text-[#5A5248] font-mono">
                            Size {item.size} · House Distressed
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border border-[#1A1512]/20">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, -1)}
                              aria-label="Decrease quantity"
                              className="w-9 h-9 flex items-center justify-center hover:bg-[#EFE9DC] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-mono tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, 1)}
                              aria-label="Increase quantity"
                              className="w-9 h-9 flex items-center justify-center hover:bg-[#EFE9DC] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.key)}
                            aria-label={`Remove ${garment.name}`}
                            className="w-9 h-9 flex items-center justify-center text-[#5A5248] hover:text-[#1A1512] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="p-6 border-t border-[#1A1512]/10 bg-[#F5F0E6] space-y-3">
            {step === 'bag' ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5A5248]">Subtotal</span>
                  <span className="font-mono font-semibold text-[#1A1512] tabular-nums">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="w-full h-12 bg-[#1F3D2B] text-[#F5F0E6] text-xs font-medium uppercase tracking-[0.12em] hover:bg-[#162D1F] transition-colors cursor-pointer"
                >
                  Continue to Allocation · ${total.toLocaleString()}
                </button>
              </>
            ) : (
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep('bag')}
                  className="px-5 h-12 border border-[#1A1512]/20 text-xs font-medium uppercase tracking-[0.08em] hover:bg-[#EAE3D5] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="stress-checkout-form"
                  disabled={submitting}
                  className="flex-1 h-12 bg-[#1F3D2B] text-[#F5F0E6] text-xs font-medium uppercase tracking-[0.12em] hover:bg-[#162D1F] transition-colors cursor-pointer disabled:opacity-60"
                >
                  {submitting
                    ? 'Reserving Allocation...'
                    : `Confirm Pre-Order · $${total.toLocaleString()}`}
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
};
