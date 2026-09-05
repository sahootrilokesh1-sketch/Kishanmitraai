import { createClient } from '@supabase/supabase-js';
import { OrderRecord, OrderItem, CheckoutFormData } from '../types';

// Supabase project credentials provided by user
export const SUPABASE_CONFIG = {
  projectName: "abhiseksahoo.bubu@outlook.com's Project",
  projectId: "egjlfigtvwgkimqadvnc",
  url: (import.meta as any).env?.VITE_SUPABASE_URL || "https://egjlfigtvwgkimqadvnc.supabase.co",
  anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "sb_publishable_LKMGylpcL8p2UyoFdLHw7A_jK3flEgu",
};

// Initialize Supabase client
export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SUPABASE_TABLE_SQL = `-- Run this in your Supabase SQL Editor to enable public table storage:
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  village TEXT,
  district TEXT,
  state TEXT,
  pincode TEXT,
  address TEXT,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'Cash on Delivery',
  delivery_date TEXT,
  order_notes TEXT,
  status TEXT DEFAULT 'Confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) and grant public permissions
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON public.orders;
CREATE POLICY "Allow public insert" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select" ON public.orders;
CREATE POLICY "Allow public select" ON public.orders FOR SELECT USING (true);
`;

const LOCAL_STORAGE_KEY = 'kisanmitra_orders_cache';

// Helper to get cached orders from localStorage
export function getLocalOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read local orders cache', e);
    return [];
  }
}

// Helper to save order to local cache
export function saveLocalOrder(order: OrderRecord): void {
  try {
    const current = getLocalOrders();
    // Prepend new order
    const updated = [order, ...current.filter(o => o.order_number !== order.order_number)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to write local orders cache', e);
  }
}

export interface CheckoutResult {
  success: boolean;
  orderNumber: string;
  orderRecord: OrderRecord;
  supabaseSynced: boolean;
  tableMissing?: boolean;
  message: string;
  errorDetail?: string;
}

/**
 * Stores checkout data in the Supabase database.
 * Also persists locally as backup so offline or pending migrations don't lose data.
 */
export async function storeCheckoutInSupabase(
  formData: CheckoutFormData,
  items: OrderItem[],
  totalAmount: number
): Promise<CheckoutResult> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `KM-ORD-${new Date().getFullYear()}-${randomSuffix}`;
  const now = new Date().toISOString();

  const newOrder: OrderRecord = {
    id: `ord_${Date.now()}_${randomSuffix}`,
    order_number: orderNumber,
    customer_name: formData.customerName,
    phone: formData.phone,
    village: formData.village,
    district: formData.district,
    state: formData.state,
    pincode: formData.pincode,
    address: formData.deliveryAddress,
    items,
    total_amount: totalAmount,
    payment_method: formData.paymentMethod,
    delivery_date: formData.deliveryDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    order_notes: formData.orderNotes || '',
    status: 'Confirmed',
    created_at: now,
    synced_to_supabase: false,
  };

  // 1. Always save to local storage first (safe offline-first guarantee)
  saveLocalOrder(newOrder);

  // 2. Prepare payload for Supabase database
  const supabasePayload = {
    order_number: newOrder.order_number,
    customer_name: newOrder.customer_name,
    phone: newOrder.phone,
    village: newOrder.village,
    district: newOrder.district,
    state: newOrder.state,
    pincode: newOrder.pincode,
    address: newOrder.address,
    items: newOrder.items,
    total_amount: newOrder.total_amount,
    payment_method: newOrder.payment_method,
    delivery_date: newOrder.delivery_date,
    order_notes: newOrder.order_notes,
    status: newOrder.status,
    created_at: newOrder.created_at,
  };

  try {
    // Call Supabase direct client
    const { data, error } = await supabase
      .from('orders')
      .insert([supabasePayload])
      .select();

    if (error) {
      console.warn('Supabase insert warning:', error);
      
      const isMissingTable = error.code === 'PGRST205' || error.message.toLowerCase().includes('schema cache') || error.message.toLowerCase().includes('does not exist');

      return {
        success: true, // checkout placed successfully
        orderNumber,
        orderRecord: newOrder,
        supabaseSynced: false,
        tableMissing: isMissingTable,
        message: isMissingTable
          ? 'Order received! Note: The "orders" table is pending creation in your Supabase project (egjlfigtvwgkimqadvnc). We saved it safely in your order queue.'
          : `Order received! Supabase error: ${error.message}. Saved to local order queue.`,
        errorDetail: error.message,
      };
    }

    // Success sync!
    newOrder.synced_to_supabase = true;
    saveLocalOrder(newOrder);

    return {
      success: true,
      orderNumber,
      orderRecord: newOrder,
      supabaseSynced: true,
      message: 'Order successfully saved to Supabase database (table: public.orders)!',
    };
  } catch (err: any) {
    console.error('Error inserting checkout to Supabase:', err);
    return {
      success: true,
      orderNumber,
      orderRecord: newOrder,
      supabaseSynced: false,
      message: `Order received and cached locally. Network to Supabase: ${err.message || 'connection issue'}.`,
      errorDetail: err.message,
    };
  }
}

/**
 * Fetches all orders from Supabase database, combined with local cache
 */
export async function fetchAllOrders(): Promise<{
  orders: OrderRecord[];
  fromSupabase: boolean;
  error?: string;
}> {
  const localOrders = getLocalOrders();

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return {
        orders: localOrders,
        fromSupabase: false,
        error: error.message,
      };
    }

    if (data && Array.isArray(data)) {
      const mapped: OrderRecord[] = data.map((d: any) => ({
        id: d.id ? String(d.id) : `sup_${d.order_number}`,
        order_number: d.order_number || 'UNKNOWN',
        customer_name: d.customer_name || 'Farmer',
        phone: d.phone || '',
        village: d.village || '',
        district: d.district || '',
        state: d.state || '',
        pincode: d.pincode || '',
        address: d.address || '',
        items: Array.isArray(d.items) ? d.items : [],
        total_amount: Number(d.total_amount || 0),
        payment_method: d.payment_method || 'Cash on Delivery',
        delivery_date: d.delivery_date || '',
        order_notes: d.order_notes || '',
        status: d.status || 'Confirmed',
        created_at: d.created_at || new Date().toISOString(),
        synced_to_supabase: true,
      }));

      // Merge with any local orders not yet in Supabase
      const existingOrderNumbers = new Set(mapped.map(m => m.order_number));
      const unSynced = localOrders.filter(l => !existingOrderNumbers.has(l.order_number));

      return {
        orders: [...unSynced, ...mapped],
        fromSupabase: true,
      };
    }

    return {
      orders: localOrders,
      fromSupabase: false,
    };
  } catch (err: any) {
    return {
      orders: localOrders,
      fromSupabase: false,
      error: err.message,
    };
  }
}

/**
 * Diagnostics check for Supabase project connection and tables
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  projectUrl: string;
  projectId: string;
  ordersTableExists: boolean;
  message: string;
}> {
  try {
    const res = await supabase.from('orders').select('id').limit(1);
    if (res.error) {
      if (res.error.code === 'PGRST205' || res.error.message.includes('schema cache')) {
        return {
          connected: true,
          projectUrl: SUPABASE_CONFIG.url,
          projectId: SUPABASE_CONFIG.projectId,
          ordersTableExists: false,
          message: 'Connected to Supabase project successfully! Table "orders" needs to be created in SQL Editor.',
        };
      }
      return {
        connected: true,
        projectUrl: SUPABASE_CONFIG.url,
        projectId: SUPABASE_CONFIG.projectId,
        ordersTableExists: false,
        message: `Supabase reached: ${res.error.message}`,
      };
    }
    return {
      connected: true,
      projectUrl: SUPABASE_CONFIG.url,
      projectId: SUPABASE_CONFIG.projectId,
      ordersTableExists: true,
      message: 'Connected to Supabase! Table "orders" is ready and active.',
    };
  } catch (e: any) {
    return {
      connected: false,
      projectUrl: SUPABASE_CONFIG.url,
      projectId: SUPABASE_CONFIG.projectId,
      ordersTableExists: false,
      message: `Unable to connect: ${e.message}`,
    };
  }
}
