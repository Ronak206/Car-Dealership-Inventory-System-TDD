import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AuthFormProps {
  mode: 'login' | 'register';
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (mode === 'register' && !name.trim()) {
      next.name = 'Name is required';
    }
    if (!email.trim()) {
      next.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      next.email = 'Enter a valid email address';
    }
    if (!password) {
      next.password = 'Password is required';
    } else if (password.length < 6) {
      next.password = 'Minimum 6 characters';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        addToast('Signed in', 'success');
        navigate('/');
      } else {
        await register(name, email, password);
        addToast('Account created — please sign in', 'success');
        navigate('/login');
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Something went wrong';
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left accent panel */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] bg-slate-900 flex-col justify-between p-10">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            DealerOps
          </h1>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">
            Inventory Console
          </p>
        </div>
        <div>
          <p className="text-sm text-white/60 leading-relaxed max-w-xs">
            Manage vehicle inventory, track stock levels, and process purchases
            from a single dashboard.
          </p>
          <div className="flex gap-6 mt-8 text-white/30">
            <div>
              <div className="text-lg font-mono tabular-nums text-white/70">
                8
              </div>
              <div className="text-[10px] uppercase tracking-wider mt-0.5">
                API Endpoints
              </div>
            </div>
            <div>
              <div className="text-lg font-mono tabular-nums text-white/70">
                2
              </div>
              <div className="text-[10px] uppercase tracking-wider mt-0.5">
                User Roles
              </div>
            </div>
            <div>
              <div className="text-lg font-mono tabular-nums text-white/70">
                JWT
              </div>
              <div className="text-[10px] uppercase tracking-wider mt-0.5">
                Auth
              </div>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-white/20">
          Car Dealership Inventory System — TDD-built backend
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="lg:hidden mb-10">
            <h1 className="text-xl font-semibold text-stone-900 tracking-tight">
              DealerOps
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Inventory Console
            </p>
          </div>

          <h2 className="text-base font-semibold text-stone-900 tracking-tight">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            {mode === 'login'
              ? 'Enter your credentials to access the console.'
              : 'Register a new account to get started.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {mode === 'register' && (
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                autoComplete="name"
                autoFocus
              />
            )}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete={mode === 'register' ? 'email' : 'username'}
              autoFocus={mode === 'login'}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete={
                mode === 'register' ? 'new-password' : 'current-password'
              }
            />
            <Button type="submit" isLoading={isLoading} className="mt-1 w-full">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-xs text-stone-400 text-center">
            {mode === 'login' ? (
              <>
                No account?{' '}
                <Link
                  to="/register"
                  className="text-amber-700 hover:text-amber-800 font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                Already registered?{' '}
                <Link
                  to="/login"
                  className="text-amber-700 hover:text-amber-800 font-medium"
                >
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}