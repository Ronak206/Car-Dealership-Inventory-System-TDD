import { useState, useEffect, type FormEvent } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { Vehicle, VehicleFormData } from '../../types';
import { useToast } from '../../context/ToastContext';
import client from '../../api/client';

interface Props {
  vehicle?: Vehicle | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = [
  'Sedan',
  'SUV',
  'Truck',
  'Coupe',
  'Hatchback',
  'Van',
  'Convertible',
  'Wagon',
];

const emptyForm: VehicleFormData = {
  make: '',
  model: '',
  category: 'Sedan',
  price: 0,
  quantity: 0,
};

interface FormErrors {
  make?: string;
  model?: string;
  category?: string;
  price?: string;
  quantity?: string;
}

export default function VehicleForm({ vehicle, onClose, onSuccess }: Props) {
  const { addToast } = useToast();
  const isEditing = !!vehicle;

  const [form, setForm] = useState<VehicleFormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setForm({
        make: vehicle.make,
        model: vehicle.model,
        category: vehicle.category,
        price: vehicle.price,
        quantity: vehicle.quantity,
      });
    }
  }, [vehicle]);

  const set = (field: keyof VehicleFormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.make.trim()) next.make = 'Required';
    if (!form.model.trim()) next.model = 'Required';
    if (!form.category) next.category = 'Required';
    if (!form.price || form.price <= 0) next.price = 'Must be greater than 0';
    if (form.quantity < 0 || form.quantity == null)
      next.quantity = 'Must be 0 or greater';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      if (isEditing) {
        await client.put(`/api/vehicles/${vehicle!._id}`, form);
        addToast('Vehicle updated', 'success');
      } else {
        await client.post('/api/vehicles', form);
        addToast('Vehicle added to inventory', 'success');
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Operation failed';
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Make"
        value={form.make}
        onChange={(e) => set('make', e.target.value)}
        error={errors.make}
        placeholder="Toyota"
        autoFocus
      />
      <Input
        label="Model"
        value={form.model}
        onChange={(e) => set('model', e.target.value)}
        error={errors.model}
        placeholder="Corolla"
      />
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
          Category
        </label>
        <select
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-xs text-red-600">{errors.category}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Price ($)"
          type="number"
          min="0"
          value={form.price || ''}
          onChange={(e) => set('price', Number(e.target.value))}
          error={errors.price}
          placeholder="25000"
        />
        <Input
          label="Quantity"
          type="number"
          min="0"
          value={form.quantity || ''}
          onChange={(e) => set('quantity', Number(e.target.value))}
          error={errors.quantity}
          placeholder="5"
        />
      </div>
      <div className="flex gap-2 pt-2 border-t border-stone-100">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {isEditing ? 'Save changes' : 'Add vehicle'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}