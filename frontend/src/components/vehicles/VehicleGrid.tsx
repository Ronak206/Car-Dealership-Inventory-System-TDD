import type { Vehicle } from '../../types';
import VehicleCard from './VehicleCard';

interface Props {
  vehicles: Vehicle[];
  isLoading: boolean;
  onUpdate: () => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onRestock: (vehicle: Vehicle) => void;
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="py-20 text-center">
      <svg
        className="mx-auto h-10 w-10 text-stone-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p className="text-sm text-stone-500 mt-3">
        {hasFilters
          ? 'No vehicles match your filters.'
          : 'No vehicles in inventory yet.'}
      </p>
      <p className="text-xs text-stone-400 mt-1">
        {hasFilters
          ? 'Try adjusting the search criteria.'
          : 'Admin users can add vehicles using the button above.'}
      </p>
    </div>
  );
}

function LoadingState() {
  // Skeleton cards to indicate loading
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="border border-stone-200 rounded p-4 animate-pulse"
        >
          <div className="flex justify-between mb-3">
            <div className="h-4 bg-stone-200 rounded w-3/4" />
            <div className="h-5 bg-stone-200 rounded w-16" />
          </div>
          <div className="h-6 bg-stone-200 rounded w-1/2 mb-6" />
          <div className="border-t border-stone-100 pt-3 flex gap-1.5">
            <div className="h-8 bg-stone-200 rounded flex-1" />
            <div className="h-8 bg-stone-200 rounded w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface VehicleGridProps extends Props {
  hasActiveFilters?: boolean;
}

export default function VehicleGrid({
  vehicles,
  isLoading,
  onUpdate,
  onEdit,
  onDelete,
  onRestock,
  hasActiveFilters = false,
}: VehicleGridProps) {
  if (isLoading) return <LoadingState />;
  if (vehicles.length === 0) return <EmptyState hasFilters={hasActiveFilters} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {vehicles.map((v) => (
        <VehicleCard
          key={v._id}
          vehicle={v}
          onUpdate={onUpdate}
          onEdit={onEdit}
          onDelete={onDelete}
          onRestock={onRestock}
        />
      ))}
    </div>
  );
}