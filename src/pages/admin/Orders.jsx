import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Edit, MessageCircle, ExternalLink } from 'lucide-react';
import { getOrders, saveOrder } from '../../services/db';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const data = await getOrders();
    setOrders(data);
    setIsLoading(false);
  };

  const handleStatusChange = async (order, newStatus) => {
    const updatedOrder = { ...order, status: newStatus };
    await saveOrder(updatedOrder);
    setOrders(orders.map(o => o.id === order.id ? updatedOrder : o));
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                          o.customer.phone.includes(search);
    const matchesFilter = filter === 'All' || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Baking': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Out for delivery': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="font-headline-lg text-2xl text-primary">Order Management</h1>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden mb-6">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search by ID, name, or phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary outline-none"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {['All', 'Pending', 'Confirmed', 'Baking', 'Out for delivery', 'Delivered'].map(status => (
              <button 
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === status ? 'bg-primary text-white shadow-md' : 'bg-surface border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-on-surface-variant">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">No orders found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 bg-surface-container-low/30">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-surface rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col hover:border-primary/50 transition-colors">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-outline-variant/20">
                  <div>
                    <h3 className="font-bold text-primary flex items-center gap-2">
                      {order.id} 
                      <span className="text-xs font-normal text-on-surface-variant">{new Date(order.createdAt).toLocaleString()}</span>
                    </h3>
                    <p className="font-medium text-lg">Rs. {order.total.toFixed(2)}</p>
                  </div>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border appearance-none cursor-pointer outline-none ${getStatusColor(order.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Baking">Baking</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                {/* Customer Details */}
                <div className="mb-4 flex-1">
                  <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Customer</h4>
                  <p className="font-medium text-on-surface">{order.customer.name}</p>
                  <p className="text-sm flex items-center gap-2 text-on-surface-variant mt-1"><Phone size={14} /> {order.customer.phone}</p>
                  <p className="text-sm flex items-start gap-2 text-on-surface-variant mt-1">
                    <MapPin size={14} className="mt-1 flex-shrink-0" /> 
                    <span className="line-clamp-2">{order.customer.address}</span>
                  </p>
                  {order.customer.lat && order.customer.lng && (
                    <a href={`https://www.openstreetmap.org/?mlat=${order.customer.lat}&mlon=${order.customer.lng}`} target="_blank" rel="noreferrer" className="text-xs text-primary mt-1 ml-5 inline-flex items-center gap-1 hover:underline">
                      View on Map <ExternalLink size={10} />
                    </a>
                  )}
                  {order.customer.notes && (
                    <div className="mt-3 bg-surface-container p-2 rounded-lg border border-outline-variant/20">
                      <p className="text-xs font-semibold text-primary mb-1">Notes:</p>
                      <p className="text-sm text-on-surface-variant italic">"{order.customer.notes}"</p>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Items</h4>
                  <ul className="space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-sm flex justify-between">
                        <span><span className="font-medium">{item.quantity}x</span> {item.name}</span>
                        <span className="text-on-surface-variant">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-4 border-t border-outline-variant/20 flex gap-2">
                  <a 
                    href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=Hello ${order.customer.name}, this is Snow Cakes! We are updating you regarding your order ${order.id}.`}
                    target="_blank" rel="noreferrer"
                    className="flex-1 bg-[#25D366]/10 text-[#128C7E] py-2 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-[#25D366]/20 transition-colors"
                  >
                    <MessageCircle size={18} /> Message
                  </a>
                  <button className="flex-1 bg-primary/10 text-primary py-2 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-primary/20 transition-colors">
                    <Edit size={18} /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
