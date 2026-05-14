import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ShoppingCart, Search, MapPin, ChevronDown, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.jpg';

const Navbar = () => {
  const { getCartCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-surface/95 dark:bg-surface-dim/95 backdrop-blur-md shadow-md py-2' : 'bg-surface py-4'}`}>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Main Navigation */}
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button className="md:hidden text-primary p-2 -ml-2" onClick={toggleMobileMenu}>
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Snow Cakes Logo" className="h-14 md:h-16 mix-blend-multiply object-contain scale-110" />
            </Link>

            {/* Desktop Links */}
            <nav className="hidden md:flex items-center gap-6 font-medium text-on-surface">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <a href="/#menu" className="hover:text-primary transition-colors">Shop</a>
              
              {/* Categories Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <button className="flex items-center gap-1 hover:text-primary transition-colors py-2">
                  Categories <ChevronDown size={16} />
                </button>
                <div className={`absolute top-full left-0 w-48 bg-surface rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden transition-all duration-200 origin-top ${isCategoriesOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible'}`}>
                  <div className="py-2 flex flex-col">
                    <a href="/#menu" className="px-4 py-2 hover:bg-surface-container-low transition-colors">Cakes</a>
                    <a href="/#menu" className="px-4 py-2 hover:bg-surface-container-low transition-colors">Pastries</a>
                    <a href="/#menu" className="px-4 py-2 hover:bg-surface-container-low transition-colors">Donuts</a>
                    <a href="/#menu" className="px-4 py-2 hover:bg-surface-container-low transition-colors">Cookies</a>
                    <a href="/#menu" className="px-4 py-2 hover:bg-surface-container-low transition-colors">Bread</a>
                    <a href="/#menu" className="px-4 py-2 hover:bg-surface-container-low transition-colors">Coffee</a>
                  </div>
                </div>
              </div>

              <a href="/#menu" className="hover:text-primary transition-colors">Best Sellers</a>
              <a href="/#menu" className="hover:text-primary transition-colors">Special Orders</a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden lg:flex relative">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="pl-10 pr-4 py-2 rounded-full border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none transition-all w-64"
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              </div>
              <button className="lg:hidden text-primary p-2">
                <Search size={24} />
              </button>
              <button 
                className="relative text-primary p-2 hover:bg-surface-container-low rounded-full transition-colors"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart size={24} />
                {getCartCount() > 0 && (
                  <span className="absolute top-0 right-0 bg-error text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-surface transform translate-x-1/4 -translate-y-1/4">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={toggleMobileMenu}>
        <div 
          className={`absolute top-0 left-0 bottom-0 w-4/5 max-w-sm bg-surface shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center">
            <span className="font-headline-md text-xl font-bold text-primary">Menu</span>
            <button onClick={toggleMobileMenu} className="p-2 text-on-surface-variant hover:text-error transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-70px)]">
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-primary outline-none"
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            </div>
            
            <Link to="/" onClick={toggleMobileMenu} className="font-medium text-lg py-2 border-b border-outline-variant/10">Home</Link>
            <a href="/#menu" onClick={toggleMobileMenu} className="font-medium text-lg py-2 border-b border-outline-variant/10">Shop</a>
            
            <div className="py-2 border-b border-outline-variant/10">
              <span className="font-medium text-lg text-primary block mb-2">Categories</span>
              <div className="grid grid-cols-2 gap-2 pl-4">
                <a href="/#menu" onClick={toggleMobileMenu} className="py-1 text-on-surface-variant">Cakes</a>
                <a href="/#menu" onClick={toggleMobileMenu} className="py-1 text-on-surface-variant">Pastries</a>
                <a href="/#menu" onClick={toggleMobileMenu} className="py-1 text-on-surface-variant">Donuts</a>
                <a href="/#menu" onClick={toggleMobileMenu} className="py-1 text-on-surface-variant">Cookies</a>
                <a href="/#menu" onClick={toggleMobileMenu} className="py-1 text-on-surface-variant">Bread</a>
                <a href="/#menu" onClick={toggleMobileMenu} className="py-1 text-on-surface-variant">Coffee</a>
              </div>
            </div>

            <a href="/#menu" onClick={toggleMobileMenu} className="font-medium text-lg py-2 border-b border-outline-variant/10">Best Sellers</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
