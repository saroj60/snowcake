import React, { useEffect, useState } from 'react';
import { ShoppingBag, ListOrdered, DollarSign, Clock } from 'lucide-react';
import { getProducts, getOrders } from '../../services/db';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    pendingOrders: 0,
    revenue: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [products, orders] = await Promise.all([getProducts(), getOrders()]);
      
      const pending = orders.filter(o => o.status === 'Pending').length;
      const revenue = orders.reduce((sum, order) => sum + order.total, 0);

      setStats({
        products: products.length,
        orders: orders.length,
        pendingOrders: pending,
        revenue: revenue
      });

      setRecentOrders(orders.slice(0, 5));
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="font-headline-lg text-2xl text-primary mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Products" value={stats.products} icon={ShoppingBag} color="bg-blue-500/10 text-blue-600" />
        <StatCard title="Total Orders" value={stats.orders} icon={ListOrdered} color="bg-green-500/10 text-green-600" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Clock} color="bg-orange-500/10 text-orange-600" />
        <StatCard title="Total Revenue" value={`Rs. ${stats.revenue.toFixed(2)}`} icon={DollarSign} color="bg-primary/10 text-primary" />
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low">
          <h2 className="font-semibold text-primary">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low/50 text-on-surface-variant text-sm">
              <tr>
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-on-surface-variant">No orders yet</td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                    <td className="px-4 py-3 text-sm">{order.customer.name}</td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold">Rs. {order.total.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-surface rounded-xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
    <div className={`p-4 rounded-lg ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-on-surface-variant mb-1">{title}</p>
      <p className="text-2xl font-bold text-on-surface">{value}</p>
    </div>
  </div>
);

export default Dashboard;
