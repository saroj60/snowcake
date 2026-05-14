import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { getProducts, saveProduct, deleteProduct } from '../../services/db';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'Cakes',
    isActive: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        id: null,
        name: '',
        price: '',
        description: '',
        image: '',
        category: 'Cakes',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productToSave = {
      ...formData,
      price: parseFloat(formData.price)
    };
    await saveProduct(productToSave);
    await fetchProducts();
    handleCloseModal();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="font-headline-lg text-2xl text-primary">Products</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low flex items-center">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-on-surface-variant">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50 text-on-surface-variant text-sm border-b border-outline-variant/30">
                <tr>
                  <th className="px-4 py-3 font-medium">Image</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-on-surface-variant">No products found</td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-4 py-3">
                        <img 
                          src={product.image || 'https://via.placeholder.com/50'} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded-md border border-outline-variant/30 bg-surface-variant"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-on-surface">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">{product.category || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm font-semibold">Rs. {product.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-surface-dim text-on-surface-variant'}`}>
                          {product.isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleOpenModal(product)} className="p-1 text-on-surface-variant hover:text-primary transition-colors mr-2">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1 text-on-surface-variant hover:text-error transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-outline-variant/30">
              <h2 className="text-xl font-bold text-primary">{formData.id ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-on-surface">Product Name *</label>
                    <input 
                      type="text" required
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-on-surface">Category</label>
                    <select 
                      value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="Cakes">Cakes</option>
                      <option value="Pastries">Pastries</option>
                      <option value="Donuts">Donuts</option>
                      <option value="Cookies">Cookies</option>
                      <option value="Bread">Bread</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-on-surface">Price (Rs.) *</label>
                    <input 
                      type="number" step="0.01" min="0" required
                      value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.isActive} 
                        onChange={e => setFormData({...formData, isActive: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      <span className="ml-3 text-sm font-medium text-on-surface">Active</span>
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-on-surface">Product Image</label>
                    <div className="flex gap-4 items-center bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-outline-variant bg-surface" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg border border-outline-variant border-dashed flex items-center justify-center text-on-surface-variant bg-surface">
                          <Plus size={20} className="opacity-50" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                        />
                        <div className="text-xs text-on-surface-variant font-medium flex items-center gap-2">
                          <span className="flex-1 h-px bg-outline-variant/30"></span>
                          OR PASTE URL
                          <span className="flex-1 h-px bg-outline-variant/30"></span>
                        </div>
                        <input 
                          type="url" 
                          value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 text-on-surface">Description *</label>
                    <textarea 
                      required rows="3"
                      value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-container-low rounded-b-xl">
              <button onClick={handleCloseModal} className="px-4 py-2 font-medium text-on-surface-variant hover:text-on-surface">Cancel</button>
              <button type="submit" form="product-form" className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 shadow-sm">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
