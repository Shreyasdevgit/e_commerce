import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SellProductPage from './pages/SellProductPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/auth" />;
  
  return <>{children}</>;
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Necessary Global Promo Bar */}
      <div className="bg-primary text-white py-2 text-center text-[10px] font-label-md uppercase tracking-[0.2em] fixed top-0 left-0 w-full z-[60]">
        Free Global Express Shipping on all orders above ₹50,000
      </div>
      <Header />
      <main className="flex-grow pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/sell" element={<ProtectedRoute><SellProductPage /></ProtectedRoute>} />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-16 px-margin-mobile md:px-margin-desktop flex flex-col items-center gap-unit text-center bg-tertiary border-t border-outline">
        <div className="font-headline-md text-headline-md font-bold text-on-tertiary mb-8">CARTIFY</div>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <a className="font-body-md text-body-md tracking-wide uppercase text-on-tertiary-container opacity-80 hover:opacity-100 transition-opacity" href="#">COLLECTIONS</a>
          <a className="font-body-md text-body-md tracking-wide uppercase text-on-tertiary-container opacity-80 hover:opacity-100 transition-opacity" href="#">OUR STORY</a>
          <a className="font-body-md text-body-md tracking-wide uppercase text-on-tertiary-container opacity-80 hover:opacity-100 transition-opacity" href="#">SHIPPING & RETURNS</a>
          <a className="font-body-md text-body-md tracking-wide uppercase text-on-tertiary-container opacity-80 hover:opacity-100 transition-opacity" href="#">PRIVACY</a>
          <a className="font-body-md text-body-md tracking-wide uppercase text-on-tertiary-container opacity-80 hover:opacity-100 transition-opacity" href="#">CONTACT</a>
        </div>
        <div className="flex items-center gap-4 mb-8 opacity-40 grayscale">
          <span className="material-symbols-outlined">payments</span>
          <span className="material-symbols-outlined">shield</span>
          <span className="material-symbols-outlined">verified</span>
          <span className="font-label-md text-[10px] uppercase tracking-widest">Secure & Encrypted Payments</span>
        </div>
        <p className="font-body-md text-body-md tracking-wide uppercase text-on-tertiary-container opacity-50">© 2024 CARTIFY. EDITORIAL COMMERCE. ALL RIGHTS RESERVED.</p>
      </footer>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-[100] flex justify-around items-center h-20 px-2 bg-white border-t border-outline-variant shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Link to="/" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[28px]">storefront</span>
          <span className="font-label-md text-[10px] uppercase mt-1">SHOP</span>
        </Link>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[28px]">search</span>
          <span className="font-label-md text-[10px] uppercase mt-1">SEARCH</span>
        </button>
        <Link to="/cart" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors relative">
          <span className="material-symbols-outlined text-[28px]">shopping_bag</span>
          <span className="font-label-md text-[10px] uppercase mt-1">BAG</span>
        </Link>
        <Link to="/orders" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[28px]">person</span>
          <span className="font-label-md text-[10px] uppercase mt-1">ORDERS</span>
        </Link>
      </nav>
      
      <Toaster position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
