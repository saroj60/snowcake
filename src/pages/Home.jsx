import { useState, useEffect } from 'react';
import { getProducts } from '../services/db';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

const Home = () => {
  const [cakes, setCakes] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts().then(products => {
      // Only show active products on storefront
      setCakes(products.filter(p => p.isActive !== false));
    });
  }, []);

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover brightness-75" 
            alt="Hero Bakery Image" 
            src="/hero.png" 
          />
        </div>
        <div className="relative z-10 text-center px-margin-mobile max-w-3xl">
          <h1 className="font-headline-xl text-headline-xl text-white mb-6 drop-shadow-md hidden md:block">Handcrafted Moments, Freshly Baked.</h1>
          <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-white mb-6 drop-shadow-md md:hidden">Handcrafted Moments.</h1>
          <p className="font-body-lg text-body-lg text-white/90 mb-10 drop-shadow-sm">Discover the alchemy of flour, water, and time in our artisan treats.</p>
          <a href="#menu" className="inline-block bg-primary-container text-on-primary font-label-lg text-label-lg px-10 py-5 rounded-full hover:opacity-80 transition-all active:scale-95 shadow-lg">
              View Menu
          </a>
        </div>
      </section>

      {/* Freshly Baked Promo */}
      <section className="py-16 px-margin-mobile bg-surface">
        <div className="max-w-container-max mx-auto text-center">
          <span className="font-label-lg text-label-lg text-primary uppercase tracking-[0.2em] mb-4 block">Our Commitment</span>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Freshly baked every day in Kathmandu.</h2>
          <div className="w-24 h-1 bg-primary-fixed mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="menu" className="py-16 max-w-container-max mx-auto px-margin-mobile">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg text-primary">Our Cakes</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">Community favorites, baked to perfection.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {cakes.map((cake) => (
            <div key={cake.id} className="bg-surface-container-low rounded-xl p-6 shadow-[0_10px_30px_rgba(62,39,35,0.08)] group flex flex-col">
              <div className="aspect-square overflow-hidden rounded-lg mb-6 bg-surface-variant">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={cake.name} 
                  src={cake.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'} 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80' }}
                />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-headline-md text-headline-md text-primary">{cake.name}</h4>
                <span className="font-label-lg text-label-lg text-on-surface-variant bg-surface px-3 py-1 rounded-full">Rs. {cake.price}</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 flex-grow">{cake.description}</p>
              <button 
                onClick={() => addToCart(cake)}
                className="w-full py-4 rounded-full bg-primary text-white font-label-lg hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
          {cakes.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-on-surface-variant text-lg">No cakes available right now. Check back later!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
