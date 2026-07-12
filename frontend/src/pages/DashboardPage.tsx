import { useState, useEffect, useCallback } from 'react';
import SearchFilters from '../components/vehicles/SearchFilters';
import VehicleGrid from '../components/vehicles/VehicleGrid';
import VehicleForm from '../components/vehicles/VehicleForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import client from '../api/client';
import type { Vehicle, SearchFilters as Filters } from '../types';

function buildSearchUrl(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.make) params.append('make', filters.make);
  if (filters.model) params.append('model', filters.model);
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice !== undefined)
    params.append('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined)
    params.append('maxPrice', String(filters.maxPrice));
  const qs = params.toString();
  return qs ? `/api/vehicles/search?${qs}` : '/api/vehicles';
}

export default function DashboardPage() {
  const { isAdmin } = useAuth();
  const { addToast } = useToast();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [restockingVehicle, setRestockingVehicle] = useState<Vehicle | null>(
    null,
  );
  const [restockQty, setRestockQty] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestocking, setIsRestocking] = useState(false);

  const fetchVehicles = useCallback(async (filters?: Filters) => {
    if (filters) {
      setIsSearching(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const url = filters ? buildSearchUrl(filters) : '/api/vehicles';
      const res = await client.get(url);
      setVehicles(res.data.vehicles);
      setHasActiveFilters(!!filters);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to load vehicles';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSearch = (filters: Filters) => {
    fetchVehicles(filters);
  };

  const handleReset = () => {
    fetchVehicles();
  };

  const handleDelete = async () => {
    if (!deletingVehicle) return;
    setIsDeleting(true);
    try {
      await client.delete(`/api/vehicles/${deletingVehicle._id}`);
      addToast('Vehicle deleted', 'success');
      fetchVehicles();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Delete failed';
      addToast(message, 'error');
    } finally {
      setIsDeleting(false);
      setDeletingVehicle(null);
    }
  };

  const handleRestock = async () => {
    if (!restockingVehicle) return;
    const qty = Number(restockQty);
    if (!qty || qty <= 0) {
      addToast('Enter a positive quantity', 'error');
      return;
    }
    setIsRestocking(true);
    try {
      await client.post(
        `/api/vehicles/${restockingVehicle._id}/restock`,
        { quantity: qty },
      );
      addToast(`Restocked +${qty} units`, 'success');
      fetchVehicles();
      setRestockingVehicle(null);
      setRestockQty('');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Restock failed';
      addToast(message, 'error');
    } finally {
      setIsRestocking(false);
    }
  };

  // Count low-stock items
  const lowStockCount = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 2)
    .length;
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1400px] mx-auto px-5 py-5">
        {/* Page header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold text-stone-900 tracking-tight">
              Inventory
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-stone-500">
                {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
              </span>
              {lowStockCount > 0 && (
                <span className="text-[11px] font-mono tabular-nums text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  {lowStockCount} low stock
                </span>
              )}
              {outOfStockCount > 0 && (
                <span className="text-[11px] font-mono tabular-nums text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                  {outOfStockCount} out of stock
                </span>
              )}
            </div>
          </div>
          {isAdmin && (
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              + Add vehicle
            </Button>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-start gap-2">
            <svg
              className="w-4 h-4 mt-0.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4l8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Search / filter bar */}
        <div className="mb-4 px-4 py-3 bg-white border border-stone-200 rounded">
          <SearchFilters
            onSearch={handleSearch}
            onReset={handleReset}
            isSearching={isSearching}
          />
        </div>

        {/* Vehicle grid */}
        <VehicleGrid
          vehicles={vehicles}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
          onUpdate={() => fetchVehicles()}
          onEdit={(v) => setEditingVehicle(v)}
          onDelete={(v) => setDeletingVehicle(v)}
          onRestock={(v) => setRestockingVehicle(v)}
        />
      </div>

      {/* ── Modals ── */}

      {/* Add Vehicle */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add vehicle"
      >
        <VehicleForm
          onClose={() => setShowAddModal(false)}
          onSuccess={() => fetchVehicles()}
        />
      </Modal>

      {/* Edit Vehicle */}
      <Modal
        isOpen={!!editingVehicle}
        onClose={() => setEditingVehicle(null)}
        title="Edit vehicle"
      >
        <VehicleForm
          vehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSuccess={() => fetchVehicles()}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deletingVehicle}
        onClose={() => setDeletingVehicle(null)}
        title="Delete vehicle"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-stone-600 leading-relaxed">
            This will permanently remove{' '}
            <span className="font-semibold text-stone-900">
              {deletingVehicle?.make} {deletingVehicle?.model}
            </span>{' '}
            from inventory. This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeletingVehicle(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Restock */}
      <Modal
        isOpen={!!restockingVehicle}
        onClose={() => {
          setRestockingVehicle(null);
          setRestockQty('');
        }}
        title="Restock vehicle"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-stone-600">
            Add stock for{' '}
            <span className="font-semibold text-stone-900">
              {restockingVehicle?.make} {restockingVehicle?.model}
            </span>
            <span className="text-stone-400 ml-1">
              (currently {restockingVehicle?.quantity})
            </span>
          </p>
          <Input
            label="Quantity to add"
            type="number"
            min="1"
            value={restockQty}
            onChange={(e) => setRestockQty(e.target.value)}
            placeholder="10"
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              onClick={handleRestock}
              isLoading={isRestocking}
              disabled={!restockQty || Number(restockQty) <= 0}
            >
              Restock
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setRestockingVehicle(null);
                setRestockQty('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}