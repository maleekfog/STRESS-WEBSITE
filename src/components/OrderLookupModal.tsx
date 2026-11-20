import React, { useEffect, useState } from 'react';
import { PackageCheck, Search, X } from 'lucide-react';
import { PreOrderRecord } from '../types/garment';

interface OrderLookupModalProps {
  isOpen: boolean;
  initialOrderId?: string;
  recentOrders: PreOrderRecord[];
  onClose: () => void;
}

const TIMELINE_STEPS = [
  'Allocation Reserved',
  'Cutting & Distressing',
  'Fault-Line Seal QC',
  'Insured Dispatch',
];

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({
  isOpen,
  initialOrderId,
  recentOrders,
  onClose,
}) => {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId ?? '');
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PreOrderRecord[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (initialOrderId) {
      setOrderIdInput(initialOrderId);
      void performLookup(initialOrderId, '');
    } else if (recentOrders.length > 0 && results.length === 0) {
      setResults(recentOrders);
    }
  }, [isOpen, initialOrderId]);

  if (!isOpen) return null;

  const performLookup = async (code: string, email: string) => {
    const trimmedCode = code.trim();
    const trimmedEmail = email.trim();
    if (!trimmedCode && !trimmedEmail) {
      setError('Enter your Allocation Order ID (e.g. STR-26-4812) or email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (trimmedCode) params.set('orderId', trimmedCode);
      if (trimmedEmail) params.set('email', trimmedEmail);

      const res = await fetch(`/api/preorders/lookup?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Could not retrieve pre-order allocation.');
      }
      setResults(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lookup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void performLookup(orderIdInput, emailInput);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1A1512]/65 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-lookup-title"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF7F2] border border-[#1A1512]/15 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#1A1512]/10 bg-[#F5F0E6] flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#1F3D2B]">
              Client Services · AW26 Batch 01
            </p>
            <h2 id="order-lookup-title" className="font-brand-serif text-2xl text-[#1A1512]">
              Track Pre-Order Allocation
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order tracker"
            className="w-10 h-10 border border-[#1A1512]/15 flex items-center justify-center hover:bg-[#EFE9DC] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5A5248] mb-1">
                Order ID
              </label>
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="STR-26-XXXX"
                className="w-full h-10 px-3 text-xs font-mono bg-[#F5F0E6] border border-[#1A1512]/20 focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5A5248] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="client@domain.com"
                className="w-full h-10 px-3 text-xs bg-[#F5F0E6] border border-[#1A1512]/20 focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-[#1F3D2B] text-[#F5F0E6] text-xs font-medium uppercase tracking-[0.08em] hover:bg-[#162D1F] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Search className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{loading ? '...' : 'Find'}</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 border border-[#8B2E22]/30 bg-[#8B2E22]/10 text-xs text-[#6B1F16]">
              {error}
            </div>
          )}

          {results.length === 0 ? (
            <div className="py-12 text-center border border-[#1A1512]/10 bg-[#F5F0E6] space-y-2">
              <PackageCheck className="w-6 h-6 text-[#5A5248] mx-auto" aria-hidden="true" />
              <p className="text-sm text-[#1A1512] font-medium">
                {searched
                  ? 'No matching pre-order allocation found.'
                  : 'Enter your Order ID or Email above to inspect production status.'}
              </p>
              <p className="text-xs text-[#5A5248]">
                Every reserved AW26 allocation carries a unique STR-26-XXXX tracking reference.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {results.map((order) => (
                <div
                  key={order.orderId}
                  className="border border-[#1A1512]/15 bg-[#F5F0E6] p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#1A1512]/10 pb-3">
                    <div>
                      <div className="font-mono text-xs font-semibold text-[#1F3D2B]">
                        {order.orderId} · {order.batch}
                      </div>
                      <div className="text-sm font-medium text-[#1A1512] mt-0.5">
                        {order.status}
                      </div>
                    </div>
                    <div className="text-right text-xs font-mono tabular-nums">
                      <div className="font-semibold text-[#1A1512]">
                        ${order.total.toLocaleString()}
                      </div>
                      <div className="text-[#5A5248]">Dispatch: {order.estimatedDispatch}</div>
                    </div>
                  </div>

                  {/* 4-Stage Allocation Timeline */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {TIMELINE_STEPS.map((label, idx) => {
                      const active = idx + 1 <= order.statusStep;
                      return (
                        <div key={label} className="space-y-1.5">
                          <div
                            className={`h-1 w-full ${
                              active ? 'bg-[#1F3D2B]' : 'bg-[#1A1512]/12'
                            }`}
                          />
                          <div
                            className={`text-[10px] font-mono leading-tight ${
                              active ? 'text-[#1A1512] font-medium' : 'text-[#7A7065]'
                            }`}
                          >
                            0{idx + 1} · {label}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Itemized Allocation Pieces */}
                  <div className="space-y-2 pt-2 border-t border-[#1A1512]/10">
                    {order.items.map((item, idx) => (
                      <div
                        key={`${order.orderId}-${idx}`}
                        className="flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-12 object-cover bg-[#EFE9DC] shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="font-medium text-[#1A1512] truncate">{item.name}</div>
                            <div className="font-mono text-[11px] text-[#5A5248]">
                              Size {item.size} × {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="font-mono text-[#1A1512] tabular-nums shrink-0">
                          ${(item.unitPrice * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#1A1512]/10 text-[11px] text-[#5A5248] flex flex-wrap justify-between gap-2">
                    <span>
                      Ship to: {order.customer.fullName}, {order.customer.address},{' '}
                      {order.customer.city}, {order.customer.country}
                    </span>
                    <span className="font-mono uppercase">{order.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
