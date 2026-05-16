import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProducts() {
      let query = supabase.from('products').select('*, profiles(full_name)');
      
      if (category !== 'All') {
        query = query.eq('category', category);
      }
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (!error) setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, [category, searchQuery]);

  return (
    <div className="bg-surface text-on-surface">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden bg-surface-container-highest">
        <img 
          className="absolute inset-0 w-full h-full object-cover object-center" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyXfoJm2N8NKeWVq5YWIf1tHVJbBdFZh2bObgAqUl6T7TCN82U4eJ0V2mT_kaEgBJVGVQ5HPM0MDwuXpBVIuhWGHDMJU6SD3M3URxplG2gG1N8oFOYhA2dcyRhBqOtfsfbbbNlOiWtlsWqQFyjFsND6JSlpsLkD-Iv2CPY4Jd_MvhS2CxUV_MX00IBZXBgWohoqPTaUCGGRmPXylii4-otIXfPL46q-p49A3nu6J0PIYiWiH5bGaxDifthiEiOxwAYVeRA3ZhYwiA"
          alt="Hero"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-center px-margin-mobile max-w-5xl">
            <h1 className="font-display-lg text-display-lg md:text-[130px] text-white mix-blend-difference mb-8 tracking-tight leading-[0.8] font-light italic">
              Defining <br className="hidden md:block" /> Tomorrow
            </h1>
            <p className="font-body-md text-body-md text-white mix-blend-difference uppercase tracking-[0.8em] mb-16 max-w-2xl mx-auto opacity-80 font-medium">
               Where luxury meets logic. Own the unowned.
             </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
              <a href="#shop" className="w-full md:w-auto bg-white text-primary font-label-md text-label-md px-20 py-5 uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-2xl">
                Explore Collection
              </a>
              <Link to="/sell" className="w-full md:w-auto border border-white/40 text-white font-label-md text-label-md px-20 py-5 uppercase tracking-[0.2em] hover:bg-white hover:text-primary transition-all duration-500 transform hover:scale-105 active:scale-95 backdrop-blur-sm">
                List Your Piece
              </Link>
            </div>
          </div>
      </section>

      {/* Filter & Search Bar */}
      <section id="shop" className="max-w-[1440px] mx-auto pt-24 px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 pb-4 border-b border-outline-variant">
          <div className="flex gap-8 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 no-scrollbar">
            {['All', 'Apparel', 'Tech', 'Accessories', 'Footwear'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`font-label-md text-label-md uppercase tracking-widest whitespace-nowrap transition-colors ${category === cat ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search pieces..."
              className="w-full bg-transparent border-b border-outline py-2 font-label-md text-label-md uppercase focus:outline-none focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="material-symbols-outlined absolute right-0 top-2 opacity-60">search</span>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-[1440px] mx-auto py-12 px-margin-mobile md:px-margin-desktop min-h-[400px]">
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="font-headline-md text-headline-md uppercase">{category === 'All' ? 'Selected Pieces' : category}</h2>
          <span className="font-body-md text-body-md opacity-60 uppercase">{products.length.toString().padStart(2, '0')} Items</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body-lg text-body-lg opacity-60">No pieces found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Editorial Layout: Product 1 (Large Feature) */}
            <div className="md:col-span-7 group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low mb-6">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={products[0].image_url} 
                  alt={products[0].name}
                />
                {products[0].exclusive && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-white px-3 py-1 font-label-md text-label-md border border-primary uppercase">Exclusive</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(products[0]); }}
                    className="bg-white text-primary px-8 py-3 font-label-md uppercase tracking-widest shadow-xl"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline-md text-headline-md leading-none">{products[0].name}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-2">{products[0].description}</p>
                </div>
                <p className="font-price-tag text-price-tag text-secondary">₹{products[0].price.toLocaleString()}</p>
              </div>
            </div>

            {/* Product 2 & 3 Column */}
            <div className="md:col-span-5 flex flex-col gap-24">
              {products.slice(1, 3).map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden bg-surface-container-low mb-6">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      src={product.image_url} 
                      alt={product.name}
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="bg-white text-primary px-8 py-3 font-label-md uppercase tracking-widest shadow-xl"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-md text-headline-md leading-none">{product.name}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-2">{product.description}</p>
                    </div>
                    <p className="font-price-tag text-price-tag text-secondary">₹{product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional products in regular grid if more than 3 */}
            {products.length > 3 && (
              <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-gutter mt-12">
                {products.slice(3).map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low mb-6">
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          className="bg-white text-primary px-8 py-3 font-label-md uppercase tracking-widest shadow-xl"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-headline-md text-headline-md leading-none">{product.name}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-2">{product.description}</p>
                      </div>
                      <p className="font-price-tag text-price-tag text-secondary">₹{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary-container text-white py-32 px-margin-mobile mt-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-6">THE CARTIFY EDIT</h2>
          <p className="font-body-lg text-body-lg mb-12 opacity-80">Subscribe to receive early access to seasonal drops and curated style narratives.</p>
          <form className="flex flex-col md:flex-row gap-4" onSubmit={e => e.preventDefault()}>
            <input className="flex-1 bg-transparent border-b border-outline text-white py-4 px-2 font-label-md text-label-md uppercase focus:outline-none focus:border-white transition-colors placeholder:text-outline" placeholder="YOUR EMAIL ADDRESS" type="email"/>
            <button className="bg-white text-primary font-label-md text-label-md px-12 py-4 uppercase tracking-widest hover:bg-surface-variant transition-colors">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
