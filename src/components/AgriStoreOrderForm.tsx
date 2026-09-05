import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Database,
  Plus,
  Minus,
  Check,
  Search,
  Filter,
  Package,
  Truck,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Copy,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { initialAgriProducts } from '../data/agriProducts';
import { AgriProduct, OrderRecord } from '../types';
import {
  fetchAllOrders,
  SUPABASE_CONFIG,
  SUPABASE_TABLE_SQL,
  checkSupabaseConnection,
  storeCheckoutInSupabase,
} from '../lib/supabase';

export const AgriStoreOrderForm: React.FC = () => {
  const {
    addToCart,
    cartItems,
    cartCount,
    cartTotal,
    setIsCheckoutModalOpen,
    farmer,
    triggerConfetti,
  } = useFarm();

  const [activeSubTab, setActiveSubTab] = useState<'store' | 'quickOrder' | 'ordersList' | 'supabaseSettings'>('store');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Live Supabase Orders state
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersFromSupabase, setOrdersFromSupabase] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Supabase Health State
  const [supabaseHealth, setSupabaseHealth] = useState<{
    connected: boolean;
    ordersTableExists: boolean;
    message: string;
  } | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Custom Quick Order Form State
  const [quickItemName, setQuickItemName] = useState('Certified High-Yield Seeds');
  const [quickQuantity, setQuickQuantity] = useState('2');
  const [quickUnit, setQuickUnit] = useState('Bags');
  const [quickNotes, setQuickNotes] = useState('');
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickOrderSuccess, setQuickOrderSuccess] = useState<string | null>(null);

  // Load orders on mount or when switching to ordersList
  const loadOrders = async () => {
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      const res = await fetchAllOrders();
      setOrders(res.orders);
      setOrdersFromSupabase(res.fromSupabase);
      if (res.error) setOrdersError(res.error);
    } catch (e: any) {
      setOrdersError(e.message);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const checkHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await checkSupabaseConnection();
      setSupabaseHealth({
        connected: res.connected,
        ordersTableExists: res.ordersTableExists,
        message: res.message,
      });
    } catch (e: any) {
      setSupabaseHealth({
        connected: false,
        ordersTableExists: false,
        message: e.message,
      });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
    loadOrders();
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_TABLE_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleAddToCart = (prod: AgriProduct) => {
    addToCart(prod, 1);
    setAddedProductId(prod.id);
    setTimeout(() => setAddedProductId(null), 1200);
  };

  // Submit custom quick order directly to Supabase
  const handleCustomOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickSubmitting(true);
    setQuickOrderSuccess(null);

    const priceEst = 1200 * Number(quickQuantity || 1);

    const customItems = [
      {
        productId: `custom-${Date.now()}`,
        name: quickItemName,
        category: 'Custom Order',
        quantity: Number(quickQuantity || 1),
        price: 1200,
        unit: quickUnit,
        total: priceEst,
      },
    ];

    try {
      const res = await storeCheckoutInSupabase(
        {
          customerName: farmer.name,
          phone: farmer.phone || farmer.mobile || '9876543210',
          village: farmer.village,
          district: farmer.district,
          state: farmer.state,
          pincode: '422003',
          deliveryAddress: `${farmer.village}, Near Panchayat, ${farmer.district}`,
          paymentMethod: 'Cash on Delivery',
          deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          orderNotes: quickNotes || 'Custom order submitted via KisanMitra order form',
        },
        customItems,
        priceEst
      );

      triggerConfetti();
      setQuickOrderSuccess(res.orderNumber);
      setQuickNotes('');
      loadOrders();
    } catch (err: any) {
      alert(`Error submitting to Supabase: ${err.message}`);
    } finally {
      setQuickSubmitting(false);
    }
  };

  // Filter products
  const categories = ['All', 'Seeds', 'Fertilizers', 'Bio-Pesticides', 'Irrigation', 'Tools'];
  const filteredProducts = initialAgriProducts.filter(prod => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.varietyOrBrand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Hero Banner & Supabase Connection Status Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                Supabase Connected Project
              </span>
              <span className="bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Direct-to-Farmer Subsidies
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Agri-Store & Order Form
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Order certified high-yield seeds, biological fertilizers, and micro-irrigation supplies.
              All checkout orders are persisted in real-time to your Supabase PostgreSQL database.
            </p>
          </div>

          {/* Supabase Connection Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shrink-0 max-w-sm w-full space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${supabaseHealth?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-xs font-bold text-white">Supabase Status</span>
              </div>
              <button
                onClick={checkHealth}
                disabled={isCheckingHealth}
                className="text-[10px] text-emerald-200 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isCheckingHealth ? 'animate-spin' : ''}`} />
                Test Ping
              </button>
            </div>

            <div className="text-[11px] font-mono space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/10 text-emerald-200">
              <div className="truncate">Project: <span className="text-white font-bold">{SUPABASE_CONFIG.projectId}</span></div>
              <div className="truncate">Table: <span className="text-white font-bold">public.orders</span></div>
              <div className="truncate text-stone-300">{SUPABASE_CONFIG.url}</div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-emerald-100">
              <span>{supabaseHealth?.message || 'Connecting to Supabase...'}</span>
              <button
                onClick={() => setActiveSubTab('supabaseSettings')}
                className="underline hover:text-white cursor-pointer font-semibold ml-2 shrink-0"
              >
                Setup SQL
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('store')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'store'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Store Products</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quickOrder')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'quickOrder'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Custom Order Form</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('ordersList');
              loadOrders();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer relative ${
              activeSubTab === 'ordersList'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('supabaseSettings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'supabaseSettings'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Database SQL & Credentials</span>
          </button>
        </div>

        {/* View Cart / Checkout Floating Trigger */}
        <button
          onClick={() => setIsCheckoutModalOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-950 px-4 py-2 rounded-xl text-xs font-black shadow-xs hover:shadow-md transition cursor-pointer shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Checkout ({cartCount})</span>
          <span className="bg-stone-900 text-white px-2 py-0.5 rounded-md text-[11px]">
            ₹{cartTotal.toLocaleString('en-IN')}
          </span>
        </button>
      </div>

      {/* VIEW 1: Store Products Catalogue */}
      {activeSubTab === 'store' && (
        <div className="space-y-5">
          {/* Filter Bar & Search */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search seed varieties, bio-fertilizers..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-stone-50/50"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(prod => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {prod.category}
                    </span>
                    {prod.badge && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 leading-snug">{prod.name}</h3>
                  <p className="text-[11px] text-stone-500 font-medium">{prod.varietyOrBrand}</p>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{prod.description}</p>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-[11px] text-stone-600 space-y-1">
                  <div className="font-semibold text-stone-800">Recommended Dosage:</div>
                  <div className="text-stone-500 line-clamp-2">{prod.dosageOrUsage}</div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-stone-900">
                      ₹{prod.pricePerUnit.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-stone-500 ml-1">/ {prod.unit}</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(prod)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                      addedProductId === prod.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                    }`}
                  >
                    {addedProductId === prod.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: Custom Quick Order Form */}
      {activeSubTab === 'quickOrder' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-700" />
              Direct Farm Order Form
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Have specific seeds or custom bulk requirements? Fill this form to record and store your order directly into your Supabase database.
            </p>
          </div>

          {quickOrderSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Order Placed & Stored in Supabase!</span>
              </div>
              <p className="text-xs">
                Order Reference: <strong className="font-mono">{quickOrderSuccess}</strong>. View it under the "Supabase Orders" tab.
              </p>
            </div>
          )}

          <form onSubmit={handleCustomOrderSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Item / Crop Variety Needed *
              </label>
              <input
                type="text"
                required
                value={quickItemName}
                onChange={e => setQuickItemName(e.target.value)}
                placeholder="e.g. Certified Sharbati Wheat Seeds, DAP Fertilizer 50kg, or Drip Kit"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Quantity Needed *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quickQuantity}
                  onChange={e => setQuickQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Unit Type
                </label>
                <select
                  value={quickUnit}
                  onChange={e => setQuickUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="Bags (50kg)">Bags (50kg)</option>
                  <option value="Packets">Packets</option>
                  <option value="Liters">Liters</option>
                  <option value="Quintals">Quintals</option>
                  <option value="Acres Set">Acres Set</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Farmer Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={farmer.name}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Contact Mobile
                </label>
                <input
                  type="text"
                  readOnly
                  value={farmer.phone || farmer.mobile}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Specific Instructions / Field Location
              </label>
              <textarea
                rows={3}
                value={quickNotes}
                onChange={e => setQuickNotes(e.target.value)}
                placeholder="Mention desired delivery dates, preferred seed brand, or landmark near farm"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={quickSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {quickSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting to Supabase Database...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Order to Supabase Table (public.orders)</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* VIEW 3: Orders List in Supabase Database */}
      {activeSubTab === 'ordersList' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-700" />
                Submitted Orders in Supabase Database
              </h3>
              <p className="text-xs text-stone-500">
                Connected to <span className="font-mono text-emerald-800 font-bold">{SUPABASE_CONFIG.url}</span> • Table: <code className="bg-stone-100 px-1 py-0.5 rounded">public.orders</code>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadOrders}
                disabled={isLoadingOrders}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                <span>Refresh Orders</span>
              </button>

              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Checkout</span>
              </button>
            </div>
          </div>

          {ordersError && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <Database className="w-4 h-4 mt-0.5 text-amber-700 shrink-0" />
              <div>
                <p className="font-bold">Supabase Query Note:</p>
                <p className="text-[11px] text-stone-600">{ordersError}</p>
                <button
                  onClick={() => setActiveSubTab('supabaseSettings')}
                  className="mt-1.5 text-emerald-800 font-bold underline cursor-pointer"
                >
                  View SQL to create the table in Supabase SQL Editor
                </button>
              </div>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-3">
              <Package className="w-10 h-10 text-stone-400 mx-auto" />
              <h4 className="text-sm font-bold text-stone-800">No Orders in Database Yet</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Place your first checkout order using the store or the checkout form to store orders in your Supabase database.
              </p>
              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 cursor-pointer"
              >
                Open Checkout Form
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(ord => (
                <div
                  key={ord.order_number || ord.id}
                  className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-stone-900 text-sm">
                            {ord.order_number}
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {ord.status || 'Confirmed'}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {new Date(ord.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-stone-500">Total Order Value</div>
                        <div className="text-base font-black text-emerald-800">
                          ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <span className="flex items-center gap-1 bg-stone-100 text-stone-700 text-[10px] font-bold px-2.5 py-1 rounded-xl border border-stone-200">
                        <Database className="w-3 h-3 text-emerald-600" />
                        Supabase
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Customer & Contact</span>
                      <span className="font-semibold text-stone-900">{ord.customer_name}</span>
                      <span className="text-stone-500 block text-[11px]">{ord.phone}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[11px]">Delivery Location</span>
                      <span className="font-semibold text-stone-900">
                        {ord.village ? `${ord.village}, ${ord.district}` : ord.address}
                      </span>
                      <span className="text-stone-500 block text-[11px]">{ord.payment_method}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block text-[11px]">Items Ordered ({ord.items?.length || 0})</span>
                      <div className="text-stone-800 font-medium truncate">
                        {ord.items?.map(i => `${i.name} (x${i.quantity})`).join(', ') || 'Agricultural supplies'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: Supabase Settings, Schema & Verification */}
      {activeSubTab === 'supabaseSettings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-700" />
                Supabase Credentials & Table Schema
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Your order form connects directly to this Supabase project to store all farmer checkouts.
              </p>
            </div>

            <button
              onClick={checkHealth}
              disabled={isCheckingHealth}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingHealth ? 'animate-spin' : ''}`} />
              <span>Verify Database Connection</span>
            </button>
          </div>

          {/* Configuration Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-400 block text-[11px]">Project Name</span>
              <span className="font-bold text-stone-800">{SUPABASE_CONFIG.projectName}</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-400 block text-[11px]">Project ID</span>
              <span className="font-mono font-bold text-emerald-800">{SUPABASE_CONFIG.projectId}</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-400 block text-[11px]">Project URL</span>
              <span className="font-mono text-stone-800 truncate block">{SUPABASE_CONFIG.url}</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-400 block text-[11px]">Public API Key</span>
              <span className="font-mono text-stone-800 truncate block">{SUPABASE_CONFIG.anonKey}</span>
            </div>
          </div>

          {/* SQL Editor Code Block */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-900">
                  PostgreSQL Table Migration Script (<code className="text-emerald-700">public.orders</code>)
                </h4>
                <p className="text-[11px] text-stone-500">
                  Paste this in your Supabase project's SQL Editor to enable public insert & select policies:
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="p-4 bg-stone-900 text-emerald-300 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed border border-stone-800 max-h-72">
              {SUPABASE_TABLE_SQL}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
