import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { SearchFilters as Filters } from '../../types';

interface Props {
  onSearch: (filters: Filters) => void;
  onReset: () => void;
  isSearching: boolean;
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

export default function SearchFilters({
  onSearch,
  onReset,
  isSearching,
}: Props) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      make: make || undefined,
      model: model || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  const handleReset = () => {
    setMake('');
    setModel('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    onReset();
  };

  const hasFilters = make || model || category || minPrice || maxPrice;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-x-3 gap-y-2"
    >
      <div className="w-32">
        <Input
          label="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          placeholder="Toyota"
        />
      </div>

      <div className="w-32">
        <Input
          label="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Corolla"
        />
      </div>

      <div className="w-32">
        <label className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-colors"
        >
          <option value="">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="w-24">
        <Input
          label="Min $"
          type="number"
          min="0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="0"
        />
      </div>

      <div className="w-24">
        <Input
          label="Max $"
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="99999"
        />
      </div>

      <div className="flex gap-1.5 pb-0.5">
        <Button type="submit" size="sm" isLoading={isSearching}>
          Search
        </Button>
        {hasFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            Clear
          </Button>
        )}
      </div>
    </form>
  );
}