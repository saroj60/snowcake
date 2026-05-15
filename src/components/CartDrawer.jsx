import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MapPin, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { saveOrder } from '../services/db';

const ADMIN_PHONE = '9779860568012'; // Primary WhatsApp Number

const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    clearCart
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    lat: null,
    lng: null
  });

  const [isDetecting, setIsDetecting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
        
        try {
          // Use OpenStreetMap Nominatim for reverse geocoding
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.display_name) {
            setFormData(prev => ({ ...prev, address: data.display_name }));
          }
        } catch (error) {
          console.error("Error fetching address details:", error);
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        console.error("Error detecting location:", error);
        alert("Unable to retrieve your location. Please ensure location permissions are granted.");
        setIsDetecting(false);
      }
    );
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in your name, phone, and delivery address.");
      return;
    }

    let orderList = cartItems.map(item => `• ${item.name} (x${item.quantity}) - Rs. ${(item.price * item.quantity).toFixed(2)}\n  Photo: ${item.image}`).join('\n\n');
    let total = getCartTotal().toFixed(2);

    let message = `*NEW ORDER - SNOW CAKES* 🍰\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${formData.name}\n`;
    message += `Phone: ${formData.phone}\n`;
    message += `Delivery Address: ${formData.address}\n`;
    if (formData.lat && formData.lng) {
      message += `Map Link: https://www.openstreetmap.org/?mlat=${formData.lat}&mlon=${formData.lng}\n`;
    }
    if (formData.notes) {
      message += `Notes: ${formData.notes}\n`;
    }
    message += `\n*Order Summary:*\n${orderList}\n\n`;
    message += `*Total Amount:* Rs. ${total}\n\n`;
    message += `Please confirm my order and share payment details. Thank you!`;

    // Save order to the database
    const orderToSave = {
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        lat: formData.lat,
        lng: formData.lng,
        notes: formData.notes
      },
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: getCartTotal()
    };

    saveOrder(orderToSave).then(() => {
      // After saving, redirect to WhatsApp
      const whatsappUrl = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      clearCart();
      setIsCartOpen(false);
    }).catch(error => {
      console.error("Failed to save order:", error);
      alert("Failed to process order. Please try again.");
    });
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-surface shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface-container-low">
          <h2 className="font-headline-md text-xl flex items-center gap-2 text-primary">
            <ShoppingBag size={24} /> 
            Your Cart
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-error/10 hover:text-error rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-70">
              <ShoppingBag size={64} className="mb-4" />
              <p className="text-lg">Your cart is empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg bg-surface-variant"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&q=80' }}
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-primary">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-on-surface-variant hover:text-error p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-medium text-on-surface-variant">Rs. {item.price.toFixed(2)}</span>
                        <div className="flex items-center gap-3 bg-surface rounded-full px-2 py-1 border border-outline-variant/30">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-primary hover:bg-primary/10 rounded-full p-1 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-primary hover:bg-primary/10 rounded-full p-1 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <div className="mt-6 border-t border-outline-variant/30 pt-6">
                <h3 className="font-headline-md text-lg text-primary mb-4">Delivery Details</h3>
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      placeholder="Full Name *"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="Phone Number *"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <div className="flex justify-between items-end mb-1">
                      <label className="text-xs font-medium text-on-surface-variant px-1">Delivery Address *</label>
                      <button 
                        type="button" 
                        onClick={handleDetectLocation}
                        disabled={isDetecting}
                        className="text-xs flex items-center gap-1 text-primary hover:text-primary-fixed transition-colors font-medium bg-primary/10 px-2 py-1 rounded-md"
                      >
                        {isDetecting ? <Loader2 size={12} className="animate-spin" /> : <MapPin size={12} />}
                        {isDetecting ? 'Detecting...' : 'Detect Location'}
                      </button>
                    </div>
                    <textarea 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange}
                      placeholder="Enter address manually or use detection"
                      required
                      rows="2"
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <textarea 
                      name="notes" 
                      value={formData.notes} 
                      onChange={handleChange}
                      placeholder="Order Notes (Optional) e.g., Birthday message on cake"
                      rows="2"
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-surface-container-low border-t border-outline-variant/30">
            <div className="flex justify-between items-center mb-4">
              <span className="text-on-surface-variant font-medium">Subtotal</span>
              <span className="font-headline-md text-xl text-primary">Rs. {getCartTotal().toFixed(2)}</span>
            </div>
            <button 
              type="submit"
              form="checkout-form"
              className="w-full py-4 rounded-xl bg-[#25D366] text-white font-bold text-lg hover:bg-[#128C7E] transition-all shadow-md flex justify-center items-center gap-2"
            >
              <span>Place Order on WhatsApp</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
            <p className="text-center text-xs text-on-surface-variant/70 mt-3">No account needed. Quick guest checkout.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
