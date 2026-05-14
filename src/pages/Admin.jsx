import { useState, useEffect } from 'react';
import { getCakes, addCake, deleteCake } from '../services/cakeService';

const Admin = () => {
  const [cakes, setCakes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    setCakes(getCakes());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description) return;
    
    const newCake = addCake({
      ...formData,
      price: parseFloat(formData.price)
    });
    
    setCakes([...cakes, newCake]);
    setFormData({ name: '', price: '', description: '', image: '' });
  };

  const handleDelete = (id) => {
    deleteCake(id);
    setCakes(cakes.filter(c => c.id !== id));
  };

  return (
    <main className="pt-24 pb-16 px-margin-mobile max-w-container-max mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Admin Dashboard</h1>
        <p className="text-on-surface-variant">Manage your Snow Cakes inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Cake Form */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-low rounded-xl p-6 shadow-md">
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Add New Cake</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Cake Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. Black Forest"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Price ($) *</label>
                <input 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. 25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Image URL</label>
                <input 
                  type="url" 
                  name="image" 
                  value={formData.image} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Description *</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Delicious cake with..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full py-3 rounded-lg bg-primary text-white font-label-lg hover:bg-primary/90 transition-all shadow-md"
              >
                Add Cake
              </button>
            </form>
          </div>
        </div>

        {/* Cake List */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-low rounded-xl p-6 shadow-md h-full">
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Current Inventory</h2>
            {cakes.length === 0 ? (
              <p className="text-on-surface-variant">No cakes in inventory. Add one to get started.</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {cakes.map(cake => (
                  <div key={cake.id} className="flex items-center gap-4 bg-surface p-4 rounded-lg border border-outline-variant/30">
                    <img 
                      src={cake.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&q=80'} 
                      alt={cake.name} 
                      className="w-16 h-16 object-cover rounded-md bg-surface-variant"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&q=80' }}
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-primary">{cake.name}</h3>
                      <p className="text-sm text-on-surface-variant">${cake.price} - {cake.description.substring(0, 50)}{cake.description.length > 50 ? '...' : ''}</p>
                    </div>
                    <button 
                      onClick={() => handleDelete(cake.id)}
                      className="p-2 text-error hover:bg-error/10 rounded-full transition-colors"
                      title="Delete Cake"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Admin;
