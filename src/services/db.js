// Mock Database Service using localStorage

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const DB_KEYS = {
  AUTH: 'snowcakes_auth',
  PRODUCTS: 'snowcakes_inventory',
  ORDERS: 'snowcakes_orders',
  SETTINGS: 'snowcakes_settings'
};

// Initialize DB if empty
if (!localStorage.getItem(DB_KEYS.SETTINGS)) {
  localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify({
    isOpen: true,
    deliveryCharge: 0
  }));
}
if (!localStorage.getItem(DB_KEYS.ORDERS)) {
  localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([]));
}

// --- Auth ---
export const login = async (email, password) => {
  await delay(500);
  if (email === 'admin@snowcakes.com' && password === 'admin123') {
    const session = { token: 'mock-jwt-token', user: { email } };
    localStorage.setItem(DB_KEYS.AUTH, JSON.stringify(session));
    return { user: session.user, error: null };
  }
  return { user: null, error: 'Invalid email or password' };
};

export const logout = async () => {
  await delay(200);
  localStorage.removeItem(DB_KEYS.AUTH);
};

export const getSession = () => {
  const session = localStorage.getItem(DB_KEYS.AUTH);
  return session ? JSON.parse(session) : null;
};

// --- Products ---
export const getProducts = async () => {
  await delay(300);
  const data = localStorage.getItem(DB_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const saveProduct = async (product) => {
  await delay(400);
  let products = await getProducts();
  if (product.id) {
    products = products.map(p => p.id === product.id ? product : p);
  } else {
    product.id = Date.now().toString();
    product.createdAt = new Date().toISOString();
    products.push(product);
  }
  localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
  return product;
};

export const deleteProduct = async (id) => {
  await delay(300);
  let products = await getProducts();
  products = products.filter(p => p.id !== id);
  localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
};

// --- Orders ---
export const getOrders = async () => {
  await delay(300);
  const data = localStorage.getItem(DB_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

export const saveOrder = async (order) => {
  await delay(300);
  let orders = await getOrders();
  if (order.id) {
    orders = orders.map(o => o.id === order.id ? order : o);
  } else {
    order.id = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    order.createdAt = new Date().toISOString();
    order.status = 'Pending';
    orders.unshift(order);
  }
  localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
  return order;
};

// --- Settings ---
export const getSettings = async () => {
  await delay(200);
  return JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS));
};

export const updateSettings = async (settings) => {
  await delay(300);
  localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(settings));
  return settings;
};
