import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CartPage() {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (items.length === 0) return;

    setLoading(true);
    try {
      // 1. Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          total_amount: total,
          shipping_address: address,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_time: item.products?.price || 0
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Clear cart
      await clearCart();
      
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-margin-mobile">
        <h2 className="font-headline-lg text-headline-lg uppercase mb-4">Your bag is empty</h2>
        <p className="font-body-lg text-body-lg opacity-60 mb-8">Discover our latest pieces and start your collection.</p>
        <button onClick={() => navigate('/')} className="bg-primary text-on-primary px-12 py-4 uppercase font-label-md tracking-widest">Shop Now</button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto py-24 px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-16">
      <div className="lg:col-span-8">
        <h2 className="font-headline-md text-headline-md uppercase mb-12 border-b border-outline-variant pb-4">Shopping Bag ({items.length})</h2>
        <div className="space-y-8">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 pb-8 border-b border-outline-variant">
              <div className="w-32 aspect-[3/4] bg-surface-container-low">
                <img src={item.products?.image_url} alt={item.products?.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-md text-headline-md leading-none mb-2">{item.products?.name}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant uppercase">{item.products?.category}</p>
                  </div>
                  <p className="font-price-tag text-price-tag text-secondary">₹{(item.products?.price || 0).toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center border border-outline-variant">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-4 py-2 hover:bg-surface-variant">-</button>
                    <span className="px-4 font-label-md">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 py-2 hover:bg-surface-variant">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="font-label-md text-label-md uppercase underline opacity-60 hover:opacity-100">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-4">
        <div className="bg-surface-container-low p-8 border border-outline-variant sticky top-24">
          <h2 className="font-headline-md text-headline-md uppercase mb-8">Order Summary</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between font-body-md">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-body-md">
              <span>Shipping</span>
              <span className="uppercase">Calculated at next step</span>
            </div>
            <div className="pt-4 border-t border-outline-variant flex justify-between font-price-tag text-headline-md">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
          
          <form onSubmit={handleCheckout} className="space-y-6">
            <div>
              <label className="font-label-md text-label-md uppercase block mb-2">Shipping Address</label>
              <textarea
                required
                className="w-full bg-transparent border-b border-outline py-2 focus:outline-none focus:border-primary min-h-[80px]"
                placeholder="Enter your full address"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-4 font-label-md uppercase tracking-widest hover:bg-on-surface-variant transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Complete Checkout'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
