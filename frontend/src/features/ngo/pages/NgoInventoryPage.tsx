import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import { Card, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { fetchInventoryThunk } from '@features/inventory/redux/inventorySlice';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function NgoInventoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useAppSelector((s) => ({
    items: s.inventory.items,
    loading: s.inventory.loading,
    error: s.inventory.error,
  }));

  useEffect(() => { dispatch(fetchInventoryThunk()); }, [dispatch]);

  if (loading) return <LoadingSkeleton rows={4} />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ink mb-4">My Organization Inventory</h1>
      {items.length === 0 ? <EmptyState title="No inventory" /> : (
        <div className="space-y-3">
          {items.map((i) => (
            <Card key={i._id} className="p-4 flex justify-between">
              <div>
                <span className="font-medium text-ink">{i.itemType}</span>
                <span className="text-sm text-muted ml-2">Qty: {i.quantity} {i.unit}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
