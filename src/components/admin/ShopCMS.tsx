import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext";
import { Plus, Trash, Edit2, ShoppingCart, DollarSign, Archive, Check, Filter, Tag, X } from "lucide-react";

export default function ShopCMS() {
  const { productsList, setProductsList, ordersList, setOrdersList, couponsList, setCouponsList, addAuditLog } = useCMS();
  const [activeSubTab, setActiveSubTab] = useState<"products" | "orders" | "coupons">("products");
  
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductState, setNewProductState] = useState({
    name: "TAPCO 5KVA Hybrid Smart Inverter",
    category: "Inverters",
    brand: "TAPCO",
    price: 950000,
    stock: 24,
    image: "https://images.unsplash.com/photo-1620038634439-d3e70cf27798?w=300",
    desc: "Seamless double-transfer bypass relay. Pure sine wave output under inductive compressor peaks."
  });

  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [newCouponState, setNewCouponState] = useState({
    code: "RAMADAN2026",
    discount: 15,
    expiry: "2026-12-31"
  });

  const showToast = (msg: string) => {
    addAuditLog(msg, "olosundelouis@gmail.com", "SUCCESS");
  };

  const handleUpdateStock = (id: string, amount: number) => {
    setProductsList(prev => prev.map(p => p.id === id ? { ...p, stock: amount } : p));
    showToast(`Adjusted inventory stock counts.`);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Remove this product catalog item permanently?")) {
      setProductsList(prev => prev.filter(p => p.id !== id));
      showToast(`Removed product ID ${id}.`);
    }
  };

  const handleAddProduct = () => {
    const fresh = {
      id: `prod-${Date.now()}`,
      ...newProductState,
      specs: {}
    };
    setProductsList(prev => [...prev, fresh]);
    setShowAddProduct(false);
    showToast(`Added product "${fresh.name}" to e-commerce catalog.`);
  };

  const handleUpdateOrderStatus = (id: string, status: string) => {
    setOrdersList(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showToast(`Updated order ${id} to ${status}`);
  };

  const handleAddCoupon = () => {
    const fresh = {
      id: `coup-${Date.now()}`,
      ...newCouponState,
      isActive: true
    };
    setCouponsList(prev => [...prev, fresh]);
    setShowAddCoupon(false);
    showToast(`Registered discount coupon code: ${fresh.code}`);
  };

  const handleDeleteCoupon = (id: string) => {
    setCouponsList(prev => prev.filter(c => c.id !== id));
    showToast(`Dismounted discount coupon.`);
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-[#0057B8]" />
            Shop & Inventory Dispatch Operations
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Maintain inventory stock counts, manage product prices, adjust discount coupons, and verify checkout delivery orders.
          </p>
        </div>

        {/* Sub-tabs toggles */}
        <div className="flex gap-1 bg-slate-50 border p-1 rounded-xl">
          {[
            { id: "products", label: "Catalog Products" },
            { id: "orders", label: "Checkout Orders" },
            { id: "coupons", label: "Coupons" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === tab.id ? "bg-[#0057B8] text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === "products" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Product Inventory</span>
            <button 
              onClick={() => setShowAddProduct(true)}
              className="px-3.5 py-2 bg-[#0057B8] hover:bg-[#0057B8]/95 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productsList.map(prod => (
              <div key={prod.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/20 flex flex-col justify-between group">
                <div className="h-40 bg-slate-100 overflow-hidden relative">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 rounded text-[9px] font-bold text-white uppercase tracking-wider">
                    {prod.category}
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-800 leading-snug line-clamp-2">{prod.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-2">{prod.desc}</p>
                  </div>

                  <div className="flex justify-between items-center text-xs font-black text-slate-900 border-t pt-2.5">
                    <span>₦{prod.price.toLocaleString()}</span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span>Stock:</span>
                      <input 
                        type="number" 
                        className="w-12 p-1 border text-center bg-white rounded text-slate-800 focus:outline-none"
                        value={prod.stock}
                        onChange={e => handleUpdateStock(prod.id, Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="w-full py-1.5 border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition text-xs font-bold cursor-pointer"
                  >
                    Deregister Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "orders" && (
        <div className="space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Verify Customer Dispatch Orders ({ordersList.length})</span>
          {ordersList.map(ord => (
            <div key={ord.id} className="border border-slate-100 p-5 rounded-2xl bg-slate-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black text-[#0057B8] bg-[#0057B8]/5 px-2 py-0.5 border border-[#0057B8]/10 rounded">
                    {ord.id}
                  </span>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide">{ord.customerName}</span>
                </div>
                <p className="text-xs font-bold text-slate-500">
                  Total Checkout: <span className="text-[#0057B8]">₦{ord.total.toLocaleString()}</span>
                </p>
                <div className="text-[10px] font-bold text-slate-400">
                  <span>Shipping Address: <span className="text-slate-600">{ord.shippingAddress}</span></span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg border ${
                  ord.status === "Delivered" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                  ord.status === "Processing" ? "bg-blue-50 border-blue-100 text-blue-700" :
                  "bg-amber-50 border-amber-100 text-amber-700"
                }`}>
                  {ord.status}
                </span>

                <div className="flex gap-1.5">
                  <button 
                    onClick={() => handleUpdateOrderStatus(ord.id, "Processing")}
                    className="px-2 py-1 bg-white border rounded text-[10px] font-black cursor-pointer text-[#0057B8]"
                  >
                    Set Processing
                  </button>
                  <button 
                    onClick={() => handleUpdateOrderStatus(ord.id, "Delivered")}
                    className="px-2 py-1 bg-white border rounded text-[10px] font-black cursor-pointer text-[#00A651]"
                  >
                    Confirm Delivered
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === "coupons" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Store Coupon Discounts</span>
            <button 
              onClick={() => setShowAddCoupon(true)}
              className="px-3 py-1.5 bg-[#0057B8] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              + Create Coupon Code
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {couponsList.map(coup => (
              <div key={coup.id} className="border border-slate-100 p-4 rounded-xl bg-slate-50/50 flex justify-between items-center text-xs font-semibold text-slate-700">
                <div className="space-y-1">
                  <span className="font-mono font-black text-slate-900 bg-white border px-2.5 py-1 rounded-md text-xs tracking-wider uppercase">
                    {coup.code}
                  </span>
                  <div className="text-[10px] font-bold text-slate-400 pt-1">
                    <span>Discount: <span className="text-[#00A651]">{coup.discount}% OFF</span></span>
                    <span className="block">Expires: {coup.expiry}</span>
                  </div>
                </div>

                <button onClick={() => handleDeleteCoupon(coup.id)} className="p-1 hover:bg-slate-100 rounded text-red-500">
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xs font-black uppercase text-slate-900">Add Product Node</h3>
              <button onClick={() => setShowAddProduct(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label>Product Display Name</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newProductState.name}
                  onChange={e => setNewProductState(p => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label>Category Group</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                    value={newProductState.category}
                    onChange={e => setNewProductState(p => ({ ...p, category: e.target.value }))}
                  />
                </div>
                <div>
                  <label>Initial Price (Naira)</label>
                  <input 
                    type="number" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                    value={newProductState.price}
                    onChange={e => setNewProductState(p => ({ ...p, price: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <label>Image URL</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newProductState.image}
                  onChange={e => setNewProductState(p => ({ ...p, image: e.target.value }))}
                />
              </div>

              <div>
                <label>Inventory Stock</label>
                <input 
                  type="number" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newProductState.stock}
                  onChange={e => setNewProductState(p => ({ ...p, stock: Number(e.target.value) }))}
                />
              </div>

              <div>
                <label>Product Description Summary</label>
                <textarea 
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 mt-1"
                  value={newProductState.desc}
                  onChange={e => setNewProductState(p => ({ ...p, desc: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button onClick={() => setShowAddProduct(false)} className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAddProduct} className="px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0057B8]/90 cursor-pointer">
                Publish Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddCoupon && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xs font-black uppercase text-slate-900">Create Store Coupon Code</h3>
              <button onClick={() => setShowAddCoupon(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label>Coupon Code Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. POWER2026"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 uppercase font-mono"
                  value={newCouponState.code}
                  onChange={e => setNewCouponState(p => ({ ...p, code: e.target.value }))}
                />
              </div>

              <div>
                <label>Discount Percentage (%)</label>
                <input 
                  type="number" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newCouponState.discount}
                  onChange={e => setNewCouponState(p => ({ ...p, discount: Number(e.target.value) }))}
                />
              </div>

              <div>
                <label>Expiry Date</label>
                <input 
                  type="date" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newCouponState.expiry}
                  onChange={e => setNewCouponState(p => ({ ...p, expiry: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button onClick={() => setShowAddCoupon(false)} className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAddCoupon} className="px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0057B8]/90 cursor-pointer">
                Create Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
