import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SellProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Apparel',
    exclusive: false
  });
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!image) {
      toast.error('Please upload a product image');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload image
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // 2. Save product data
      const { error: dbError } = await supabase
        .from('products')
        .insert([{
          ...formData,
          price: parseFloat(formData.price),
          image_url: publicUrl,
          seller_id: user.id
        }]);

      if (dbError) throw dbError;

      toast.success('Product listed successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-24 px-margin-mobile">
      <h2 className="font-headline-md text-headline-md uppercase mb-12 border-b border-outline-variant pb-4">Sell Your Piece</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="font-label-md text-label-md uppercase block mb-2">Product Name</label>
          <input
            type="text"
            required
            className="w-full border-b border-outline py-2 focus:outline-none focus:border-primary"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <label className="font-label-md text-label-md uppercase block mb-2">Description</label>
          <textarea
            required
            className="w-full border-b border-outline py-2 focus:outline-none focus:border-primary min-h-[100px]"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="font-label-md text-label-md uppercase block mb-2">Price (₹)</label>
            <input
              type="number"
              required
              className="w-full border-b border-outline py-2 focus:outline-none focus:border-primary"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <div>
            <label className="font-label-md text-label-md uppercase block mb-2">Category</label>
            <select
              className="w-full border-b border-outline py-2 focus:outline-none focus:border-primary"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="Apparel">Apparel</option>
              <option value="Tech">Tech</option>
              <option value="Accessories">Accessories</option>
              <option value="Footwear">Footwear</option>
            </select>
          </div>
        </div>
        <div>
          <label className="font-label-md text-label-md uppercase block mb-2">Product Image</label>
          <input
            type="file"
            accept="image/*"
            required
            className="w-full py-4"
            onChange={e => setImage(e.target.files?.[0] || null)}
          />
        </div>
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            id="exclusive"
            checked={formData.exclusive}
            onChange={e => setFormData({...formData, exclusive: e.target.checked})}
          />
          <label htmlFor="exclusive" className="font-label-md text-label-md uppercase">Mark as Exclusive</label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary py-4 font-label-md uppercase tracking-widest hover:bg-on-surface-variant transition-colors disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'List Product'}
        </button>
      </form>
    </div>
  );
}
