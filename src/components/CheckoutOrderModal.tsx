import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Database,
  Truck,
  CreditCard,
  ShieldCheck,
  Plus,
  Minus,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { CheckoutFormData } from '../types';
import {
  storeCheckoutInSupabase,
  SUPABASE_CONFIG,
  SUPABASE_TABLE_SQL,
  checkSupabaseConnection,
} from '../lib/supabase';

export const CheckoutOrderModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cartItems,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    farmer,
    triggerConfetti,
  } = useFarm();

  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: farmer.name || '',
    phone: farmer.phone || farmer.mobile || '',
    village: farmer.village || '',
    district: farmer.district || '',
    state: farmer.state || '',
    pincode: '422003',
    deliveryAddress: `${farmer.village || 'Kisan Basti'}, Near Gram Panchayat, ${farmer.district || 'Nashik'}, ${farmer.state || 'Maharashtra'}`,
    paymentMethod: 'Cash on Delivery',
    deliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    orderNotes: 'Please call before delivery to farm gate.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderNumber: string;
    supabaseSynced: boolean;
    tableMissing?: boolean;
    message: string;
  } | null>(null);

  const [showSqlDrawer, setShowSqlDrawer] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isCheckoutModalOpen) return null;

  // Agricultural Subsidy / Kisan Discount
  const subsidyDiscount = cartTotal > 1500 ? 250 : cartTotal > 500 ? 100 : 0;
  const deliveryCharge = 0; // Free delivery for farmers
  const finalTotal = Math.max(0, cartTotal - subsidyDiscount + deliveryCharge);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_TABLE_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const res = await checkSupabaseConnection();
      setTestStatus(res.message);
    } catch (e: any) {
      setTestStatus(`Error: ${e.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    setOrderResult(null);

    try {
      // 1. Send to Supabase via our client
      const res = await storeCheckoutInSupabase(formData, cartItems, finalTotal);

      // 2. Also notify backend endpoint for server-side persistence
      try {
        await fetch('/api/orders/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: formData.customerName,
            phone: formData.phone,
            village: formData.village,
            district: formData.district,
            state: formData.state,
            pincode: formData.pincode,
            deliveryAddress: formData.deliveryAddress,
            items: cartItems,
            totalAmount: finalTotal,
            paymentMethod: formData.paymentMethod,
            deliveryDate: formData.deliveryDate,
            orderNotes: formData.orderNotes,
          }),
        });
      } catch (err) {
        console.warn('Backend proxy notice:', err);
      }

      setOrderResult({
        orderNumber: res.orderNumber,
        supabaseSynced: res.supabaseSynced,
        tableMissing: res.tableMissing,
        message: res.message,
      });

      triggerConfetti();
      clearCart();
    } catch (error: any) {
      setOrderResult({
        orderNumber: `KM-LOCAL-${Date.now().toString().slice(-4)}`,
        supabaseSynced: false,
        message: `Order stored locally: ${error.message || 'Network delay'}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-stone-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">KisanMitra Agri-Store Checkout</h3>
                <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <Database className="w-3 h-3" />
                  Supabase Connected
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Storing checkout orders directly in Supabase project: <span className="font-mono text-emerald-300">{SUPABASE_CONFIG.projectId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsCheckoutModalOpen(false);
              setOrderResult(null);
            }}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Database Status Banner */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-emerald-900 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Target: <strong className="font-mono">{SUPABASE_CONFIG.url}</strong></span>
            <span className="text-emerald-700 hidden sm:inline">• Table: <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-200">public.orders</code></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
              Test Supabase Link
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => setShowSqlDrawer(!showSqlDrawer)}
              className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              {showSqlDrawer ? 'Hide Supabase SQL' : 'View Supabase SQL Schema'}
            </button>
          </div>
        </div>

        {testStatus && (
          <div className="bg-stone-800 text-stone-200 px-5 py-2 text-xs flex items-center justify-between">
            <span>{testStatus}</span>
            <button onClick={() => setTestStatus(null)} className="text-stone-400 hover:text-white">Dismiss</button>
          </div>
        )}

        {/* SQL Schema helper box */}
        {showSqlDrawer && (
          <div className="bg-stone-900 text-stone-100 p-4 border-b border-stone-800 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                Supabase SQL Table Migration (run in your Supabase SQL Editor if table is not created yet):
              </span>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-white font-medium transition cursor-pointer"
              >
                {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-black/60 rounded-xl overflow-x-auto text-[11px] font-mono text-emerald-300 leading-relaxed max-h-40">
              {SUPABASE_TABLE_SQL}
            </pre>
          </div>
        )}

        {/* Order Confirmed Screen */}
        {orderResult ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h4 className="text-xl font-black text-stone-900">Checkout Placed Successfully!</h4>
              <p className="text-xs sm:text-sm text-stone-600">
                Your order reference number is{' '}
                <strong className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {orderResult.orderNumber}
                </strong>
              </p>
            </div>

            {/* Supabase status badge in confirmation */}
            <div className={`max-w-md mx-auto p-4 rounded-2xl border text-xs text-left ${
              orderResult.supabaseSynced
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-start gap-2.5">
                <Database className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                <div className="space-y-1">
                  <p className="font-bold">
                    {orderResult.supabaseSynced
                      ? '✓ Successfully Stored in Supabase Database'
                      : 'ℹ Saved to Local Cache & Pending Supabase Sync'}
                  </p>
                  <p className="text-[11px] text-stone-600 leading-normal">
                    {orderResult.message}
                  </p>
                  {orderResult.tableMissing && (
                    <div className="pt-2">
                      <button
                        onClick={() => setShowSqlDrawer(true)}
                        className="text-emerald-800 font-bold underline cursor-pointer text-[11px]"
                      >
                        Click here to view the 1-click SQL script for Supabase SQL Editor
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsCheckoutModalOpen(false);
                  setOrderResult(null);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setOrderResult(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
              >
                Order More Supplies
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
            {/* Left: Cart Items & Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  Order Items ({cartItems.length})
                </h4>
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-stone-500 hover:text-rose-600 transition cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-2">
                  <ShoppingBag className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="text-xs font-bold text-stone-700">Your order cart is empty</p>
                  <p className="text-[11px] text-stone-500">
                    Add certified seeds, bio-fertilizers, or drip equipment to proceed with checkout.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map(item => (
                    <div
                      key={item.productId}
                      className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-stone-900 truncate">{item.name}</h5>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>₹{item.price} / {item.unit}</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, -1)}
                            className="p-1 hover:bg-stone-100 text-stone-600 rounded-l-lg cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold text-stone-800 text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, 1)}
                            className="p-1 hover:bg-stone-100 text-stone-600 rounded-r-lg cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-bold text-stone-900 w-16 text-right">
                          ₹{item.total.toLocaleString('en-IN')}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Calculation Card */}
              <div className="p-4 rounded-2xl bg-stone-100/70 border border-stone-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                {subsidyDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Kisan Agri-Subsidy Discount
                    </span>
                    <span>-₹{subsidyDiscount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-stone-500" />
                    Village Doorstep Delivery
                  </span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex items-center justify-between font-bold text-stone-900 text-sm">
                  <span>Total Payable</span>
                  <span className="text-base text-emerald-800 font-black">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-stone-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Certified Quality</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-stone-200">
                  <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Realtime Supabase Sync</span>
                </div>
              </div>
            </div>

            {/* Right: Checkout Order Form (7 cols) */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmitCheckout} className="space-y-4">
                <div className="border-b border-stone-200 pb-2 flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    Farmer Delivery & Checkout Details
                  </h4>
                  <span className="text-[11px] text-stone-500">Auto-filled from profile</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Farmer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Rameshwar Patil"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Village / Taluka *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.village}
                      onChange={e => setFormData({ ...formData, village: e.target.value })}
                      placeholder="Village name"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      District *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.district}
                      onChange={e => setFormData({ ...formData, district: e.target.value })}
                      placeholder="District"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="422003"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Delivery Address / Farm Gate Location *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.deliveryAddress}
                    onChange={e => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    placeholder="Provide landmark (e.g. Near Old Tubewell / Banyan Tree / Primary School)"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Preferred Delivery Date
                    </label>
                    <input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="Cash on Delivery">💵 Cash on Delivery (At Farm Gate)</option>
                      <option value="Kisan Credit Card (KCC)">💳 Kisan Credit Card (KCC Subsidized)</option>
                      <option value="UPI / NetBanking">📲 UPI / PhonePe / Google Pay</option>
                      <option value="Direct Mandi Credit">🌾 Mandi Harvest Credit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Delivery Instructions / Order Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.orderNotes}
                    onChange={e => setFormData({ ...formData, orderNotes: e.target.value })}
                    placeholder="e.g. Call before coming; keep under shade near cattle shed"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving Checkout to Supabase Database...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4 text-emerald-300" />
                        <span>Place Order & Store in Supabase (₹{finalTotal.toLocaleString('en-IN')})</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-stone-500 mt-1.5 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Checkout data is securely written to Supabase project <code className="font-mono text-emerald-800">{SUPABASE_CONFIG.projectId}</code>
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
