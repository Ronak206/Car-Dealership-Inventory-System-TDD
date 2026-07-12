import type { Vehicle } from '../../types';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import client from '../../api/client';
import { useState } from 'react';

interface Props {
  vehicle: Vehicle;
  onUpdate: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onRestock: (vehicle: Vehicle) => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function VehicleCard({
  vehicle,
  onUpdate,
  onEdit,
  onDelete,
  onRestock,
}: Props) {
  const { isAdmin } = useAuth();
  const { addToast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const isOutOfStock = vehicle.quantity === 0;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      await client.post(`/api/vehicles/${vehicle._id}/purchase`);
      addToast('Purchased successfully', 'success');
      onUpdate();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Purchase failed';
      addToast(message, 'error');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div
      className={[
        'border rounded p-4 flex flex-col gap-2.5 transition-colors',
        isOutOfStock
          ? 'border-stone-200 bg-stone-50/60'
          : 'border-stone-200 bg-white hover:border-stone-300',
      ].join(' ')}
    >
      {/* Top: name + stock badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-stone-900 truncate">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">{vehicle.category}</p>
        </div>
        <span
          className={[
            'text-[11px] font-mono tabular-nums px-2 py-0.5 rounded shrink-0',
            vehicle.quantity === 0
              ? 'bg-red-50 text-red-600'
              : vehicle.quantity <= 2
                ? 'bg-amber-50 text-amber-700'
                : 'bg-stone-100 text-stone-600',
          ].join(' ')}
        >
          {vehicle.quantity} in stock
        </span>
      </div>

      {/* Price */}
      <div className="font-mono text-lg tabular-nums text-stone-900 tracking-tight">
        {formatPrice(vehicle.price)}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 mt-auto pt-2.5 border-t border-stone-100">
        <Button
          size="sm"
          onClick={handlePurchase}
          disabled={isOutOfStock}
          isLoading={isPurchasing}
          variant={isOutOfStock ? 'secondary' : 'primary'}
          className="flex-1"
        >
          {isOutOfStock ? 'Out of stock' : 'Purchase'}
        </Button>

        {isAdmin && (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit(vehicle)}
              title="Edit vehicle"
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(vehicle)}
              className="text-red-600 hover:bg-red-50"
              title="Delete vehicle"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4m2 0v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4h9.34z" />
              </svg>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRestock(vehicle)}
              className="text-amber-700 hover:bg-amber-50"
              title="Restock vehicle"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M8 3v10M3 8h10" />
              </svg>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}