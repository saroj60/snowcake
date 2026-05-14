import { supabase } from '../lib/supabase';

// --- Auth ---
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user: data?.user, error: error?.message };
};

export const logout = async () => {
  await supabase.auth.signOut();
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// --- Products ---
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(p => ({
    ...p,
    image: p.image_url,
    isActive: p.is_active
  }));
};

export const saveProduct = async (product) => {
  const productData = {
    name: product.name,
    description: product.description,
    price: product.price,
    image_url: product.image,
    category: product.category,
    is_active: product.isActive,
  };

  if (product.id) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', product.id)
      .select();
    if (error) throw error;
    return data[0];
  } else {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();
    if (error) throw error;
    return data[0];
  }
};

export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// --- Storage ---
export const uploadImage = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// --- Orders ---
export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data.map(o => ({
    ...o,
    customer: {
      name: o.customer_name,
      phone: o.customer_phone,
      address: o.customer_address,
      lat: o.lat,
      lng: o.lng,
      notes: o.notes
    }
  }));
};

export const saveOrder = async (order) => {
  const orderData = {
    id: order.id || 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    customer_name: order.customer.name,
    customer_phone: order.customer.phone,
    customer_address: order.customer.address,
    lat: order.customer.lat,
    lng: order.customer.lng,
    notes: order.customer.notes,
    items: order.items,
    total: order.total,
    status: order.status || 'Pending'
  };

  const { data, error } = await supabase
    .from('orders')
    .upsert([orderData])
    .select();
  
  if (error) throw error;
  return data[0];
};

// --- Settings ---
export const getSettings = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data || { isOpen: true, deliveryCharge: 0 };
};

export const updateSettings = async (settings) => {
  const { data, error } = await supabase
    .from('settings')
    .upsert([{ id: 1, ...settings }])
    .select();
  
  if (error) throw error;
  return data[0];
};
