import { useEffect, useMemo, useState } from 'react';
import { AtelierModal } from './components/AtelierModal';
import { BagDrawer } from './components/BagDrawer';
import { CollectionGrid } from './components/CollectionGrid';
import { Footer } from './components/Footer';
import { FounderArchiveModal } from './components/FounderArchiveModal';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LookbookAndHouseSection } from './components/LookbookAndHouseSection';
import { ManufacturerTechPackModal } from './components/ManufacturerTechPackModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { GARMENTS } from './data/garments';
import {
  BagItem,
  CustomGarmentOverrides,
  Garment,
  PreOrderRecord,
} from './types/garment';

const BAG_STORAGE_KEY = 'stress_capsule_bag_v6';
const OVERRIDES_STORAGE_KEY = 'stress_atelier_overrides_v6';
const RECENT_ORDERS_STORAGE_KEY = 'stress_preorders_recent_v1';

export default function App() {
  const [bagItems, setBagItems] = useState<BagItem[]>(() => {
    try {
      const raw = localStorage.getItem(BAG_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as BagItem[]) : [];
    } catch {
      return [];
    }
  });

  const [customOverridesMap, setCustomOverridesMap] = useState<
    Record<string, CustomGarmentOverrides>
  >(() => {
    try {
      const raw = localStorage.getItem(OVERRIDES_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, CustomGarmentOverrides>) : {};
    } catch {
      return {};
    }
  });

  const [recentOrders, setRecentOrders] = useState<PreOrderRecord[]>(() => {
    try {
      const raw = localStorage.getItem(RECENT_ORDERS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as PreOrderRecord[]) : [];
    } catch {
      return [];
    }
  });

  const [inspectedGarment, setInspectedGarment] = useState<Garment | null>(null);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isFounderArchiveOpen, setIsFounderArchiveOpen] = useState(false);
  const [orderLookupState, setOrderLookupState] = useState<{
    isOpen: boolean;
    orderId?: string;
  }>({ isOpen: false });
  const [techPackState, setTechPackState] = useState<{
    isOpen: boolean;
    garmentId?: string;
  }>({ isOpen: false });

  useEffect(() => {
    try {
      localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bagItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [bagItems]);

  useEffect(() => {
    try {
      localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(customOverridesMap));
    } catch {
      // Ignore storage quota errors
    }
  }, [customOverridesMap]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_ORDERS_STORAGE_KEY, JSON.stringify(recentOrders));
    } catch {
      // Ignore storage quota errors
    }
  }, [recentOrders]);

  const spotlightGarments = useMemo(() => {
    const ids = ['stress-59', 'stress-60', 'stress-68', 'stress-04', 'stress-67'];
    return ids
      .map((id) => GARMENTS.find((g) => g.id === id))
      .filter((g): g is Garment => Boolean(g));
  }, []);

  const totalBagCount = useMemo(
    () => bagItems.reduce((sum, item) => sum + item.quantity, 0),
    [bagItems],
  );

  const handleOpenTechPack = (garmentId?: string) => {
    setTechPackState({ isOpen: true, garmentId });
  };

  const handleAddToBag = (
    garment: Garment,
    size: string,
    overrides?: CustomGarmentOverrides,
  ) => {
    const effectiveOverrides = overrides ?? customOverridesMap[garment.id];
    const specSignature = effectiveOverrides
      ? JSON.stringify(effectiveOverrides)
      : 'default';
    const key = `${garment.id}::${size}::${specSignature}`;

    setBagItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          key,
          garmentId: garment.id,
          size,
          quantity: 1,
          customOverrides: effectiveOverrides,
        },
      ];
    });
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (key: string) => {
    setBagItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleSaveOverrides = (
    garmentId: string,
    overrides: CustomGarmentOverrides,
  ) => {
    setCustomOverridesMap((prev) => ({ ...prev, [garmentId]: overrides }));
  };

  const handleResetOverrides = (garmentId: string) => {
    setCustomOverridesMap((prev) => {
      const next = { ...prev };
      delete next[garmentId];
      return next;
    });
  };

  const handleOrderCreated = (order: PreOrderRecord) => {
    setRecentOrders((prev) => [order, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#1A1512] flex flex-col">
      <Header
        bagCount={totalBagCount}
        onOpenBag={() => setIsBagOpen(true)}
        onOpenOrderLookup={() => setOrderLookupState({ isOpen: true })}
      />

      <main className="flex-1">
        <HeroSection
          spotlightGarments={spotlightGarments}
          onInspectGarment={setInspectedGarment}
          onOpenOrderLookup={() => setOrderLookupState({ isOpen: true })}
        />

        <CollectionGrid
          garments={GARMENTS}
          customOverridesMap={customOverridesMap}
          onInspectGarment={setInspectedGarment}
          onAddToBag={handleAddToBag}
        />

        <LookbookAndHouseSection
          garments={GARMENTS}
          onInspectGarment={setInspectedGarment}
        />
      </main>

      <Footer
        onOpenOrderLookup={() => setOrderLookupState({ isOpen: true })}
        onOpenTechPack={() => handleOpenTechPack(GARMENTS[0]?.id)}
        onOpenFounderArchive={() => setIsFounderArchiveOpen(true)}
      />

      <AtelierModal
        garment={inspectedGarment}
        allGarments={GARMENTS}
        savedOverrides={
          inspectedGarment ? customOverridesMap[inspectedGarment.id] : undefined
        }
        onClose={() => setInspectedGarment(null)}
        onSelectGarment={setInspectedGarment}
        onSaveOverrides={handleSaveOverrides}
        onResetOverrides={handleResetOverrides}
        onAddToBag={handleAddToBag}
        onOpenBag={() => setIsBagOpen(true)}
      />

      <BagDrawer
        isOpen={isBagOpen}
        items={bagItems}
        garments={GARMENTS}
        onClose={() => setIsBagOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearBag={() => setBagItems([])}
        onOrderCreated={handleOrderCreated}
        onOpenOrderLookup={(orderId) =>
          setOrderLookupState({ isOpen: true, orderId })
        }
      />

      <OrderLookupModal
        isOpen={orderLookupState.isOpen}
        initialOrderId={orderLookupState.orderId}
        recentOrders={recentOrders}
        onClose={() => setOrderLookupState({ isOpen: false })}
      />

      <FounderArchiveModal
        isOpen={isFounderArchiveOpen}
        garments={GARMENTS}
        customOverridesMap={customOverridesMap}
        onClose={() => setIsFounderArchiveOpen(false)}
        onInspectGarment={setInspectedGarment}
        onOpenTechPack={handleOpenTechPack}
      />

      <ManufacturerTechPackModal
        isOpen={techPackState.isOpen}
        garments={GARMENTS}
        initialGarmentId={techPackState.garmentId}
        onClose={() => setTechPackState({ isOpen: false })}
      />
    </div>
  );
}
