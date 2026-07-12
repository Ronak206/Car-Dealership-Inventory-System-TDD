import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 h-12 flex items-center px-5 gap-5 shrink-0 z-30">
      {/* Brand */}
      <Link
        to="/"
        className="text-sm font-semibold tracking-tight text-stone-300 hover:text-white transition-colors"
      >
        DealerOps
      </Link>

      <div className="h-4 w-px bg-white/15" />

      {/* Nav link — only when authenticated */}
      {user && (
        <Link
          to="/"
          className="text-[11px] text-white/50 hover:text-white/80 uppercase tracking-widest transition-colors"
        >
          Inventory
        </Link>
      )}

      {/* Right side */}
      {user && (
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className={[
                'text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded',
                isAdmin
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'bg-white/10 text-white/40',
              ].join(' ')}
            >
              {user.role}
            </span>
            <span className="text-xs text-white/40 hidden sm:inline">
              {user.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-[11px] text-white/40 hover:text-white/80 uppercase tracking-wider transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}