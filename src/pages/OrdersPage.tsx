import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [user]);

  if (loading) return <div className="py-24 text-center">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-margin-mobile">
        <h2 className="font-headline-lg text-headline-lg uppercase mb-4">No orders yet</h2>
        <p className="font-body-lg text-body-lg opacity-60 mb-8">Your order history will appear here once you make a purchase.</p>
        <button onClick={() => navigate('/')} className="bg-primary text-on-primary px-12 py-4 uppercase font-label-md tracking-widest">Shop Now</button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto py-24 px-margin-mobile md:px-margin-desktop">
      <h2 className="font-headline-md text-headline-md uppercase mb-12 border-b border-outline-variant pb-4">Order History</h2>
      <div className="space-y-12">
        {orders.map((order) => (
          <div key={order.id} className="border border-outline-variant p-8">
            <div className="flex flex-wrap justify-between items-baseline mb-8 pb-4 border-b border-outline-variant gap-4">
              <div>
                <p className="font-label-md text-label-md uppercase opacity-60 mb-1">Order ID</p>
                <p className="font-body-md font-bold">{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <p className="font-label-md text-label-md uppercase opacity-60 mb-1">Date</p>
                <p className="font-body-md">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-label-md text-label-md uppercase opacity-60 mb-1">Status</p>
                <p className="font-body-md uppercase text-secondary">{order.status}</p>
              </div>
              <div>
                <p className="font-label-md text-label-md uppercase opacity-60 mb-1">Total</p>
                <p className="font-price-tag text-price-tag">₹{order.total_amount.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-surface-container-low flex-shrink-0">
                    <img src={item.products?.image_url} alt={item.products?.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-body-md font-bold leading-tight mb-1">{item.products?.name}</h4>
                    <p className="font-body-md opacity-60">Qty: {item.quantity}</p>
                    <p className="font-body-md">₹{item.price_at_time.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-4 border-t border-outline-variant">
              <p className="font-label-md text-label-md uppercase opacity-60 mb-2">Shipping Address</p>
              <p className="font-body-md max-w-md">{order.shipping_address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
