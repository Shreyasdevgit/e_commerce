import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-surface border-b border-outline-variant fixed top-0 left-0 w-full z-50 h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="scale-95 active:opacity-80 transition-all">
          <span className="material-symbols-outlined text-primary">menu</span>
        </button>
      </div>
      
      <Link to="/" className="font-headline-lg text-headline-lg font-bold text-primary tracking-tighter">CARTIFY</Link>
      
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/sell" className="hidden md:block font-label-md text-label-md uppercase hover:opacity-70 transition-opacity">Sell</Link>
            <Link to="/orders" className="hidden md:block font-label-md text-label-md uppercase hover:opacity-70 transition-opacity">Orders</Link>
            <button onClick={signOut} className="hidden md:block font-label-md text-label-md uppercase hover:opacity-70 transition-opacity">Logout</button>
            <Link to="/cart" className="relative scale-95 active:opacity-80 transition-all">
              <span className="material-symbols-outlined text-primary">shopping_bag</span>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {items.length}
                </span>
              )}
            </Link>
          </>
        ) : (
          <Link to="/auth" className="font-label-md text-label-md uppercase hover:opacity-70 transition-opacity">Login</Link>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[60]" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-64 h-full p-8 flex flex-col gap-8 shadow-xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsMenuOpen(false)} className="self-end">
              <span className="material-symbols-outlined">close</span>
            </button>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-headline-md uppercase">Home</Link>
            {user ? (
              <>
                <Link to="/sell" onClick={() => setIsMenuOpen(false)} className="font-headline-md uppercase">Sell Piece</Link>
                <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="font-headline-md uppercase">My Orders</Link>
                <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="text-left font-headline-md uppercase">Logout</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="font-headline-md uppercase">Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
