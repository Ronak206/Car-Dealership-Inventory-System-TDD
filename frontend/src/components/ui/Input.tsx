import { type InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || autoId;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="text-[11px] font-medium text-stone-500 uppercase tracking-wider"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full px-3 py-2 text-sm bg-white border rounded',
            'placeholder:text-stone-400',
            'focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600',
            'disabled:bg-stone-100 disabled:text-stone-500',
            'transition-colors',
            error ? 'border-red-500' : 'border-stone-300',
            className,
          ].join(' ')}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;