import React, { useState } from "react";
import { 
  ShoppingBag, Search, PlusCircle, Trash2, Edit, RefreshCw,
  X, Check, DollarSign, Calendar, Sliders, Box, AlertTriangle, Truck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProductItem, Order } from "./AdminData";

interface ProcurementHubProps {
  products: ProductItem[];
  orders: Order[];
  onUpdateProductPrice: (id: string, price: number) => void;
  onUpdateOrderStatus: (id: string, status: Order["status"]) => void;
  onAddProduct: (prod: Omit<ProductItem, "id" | "alert">) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProcurementHub({
  products,
  orders,
  onUpdateProductPrice,
  onUpdateOrderStatus,
  onAddProduct,
  onDeleteProduct
}: ProcurementHubProps) {
  const [activeCatalogTab, setActiveCatalogTab] = useState<"catalog" | "orders">("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Pricing inline editing
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // New Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProd, setNewProd] = useState({
    name: "",
    category: "panels" as ProductItem["category"],
    price: 350000,
    stock: 20,
    supplier: "JA Solar Ltd"
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter(o => 
    o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-black text-[#0057B8] tracking-widest">Warehousing & Fulfillment</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Direct Procurement & Inventory Hub</h2>
          <p className="text-xs text-slate-400 mt-0.5">Control certified equipment price sheets, watch inventory limits, and dispatch orders.</p>
        </div>
        {activeCatalogTab === "catalog" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Onboard Product</span>
          </button>
        )}
      </div>

      {/* TABS & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white border border-[#E2E8F0] p-4 rounded-[20px] shadow-sm">
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveCatalogTab("catalog")}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeCatalogTab === "catalog" ? "bg-white text-[#0057B8] shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Stock Inventory Catalog
          </button>
          <button
            onClick={() => setActiveCatalogTab("orders")}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeCatalogTab === "orders" ? "bg-white text-[#00A651] shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Equipment Purchase Orders
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeCatalogTab === "catalog" ? "Search equipment..." : "Search buyer or order id..."}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {activeCatalogTab === "catalog" ? (
        /* STOCK INVENTORY VIEW */
        <div className="space-y-6">
          {/* Sub-Category Nav */}
          <div className="flex flex-wrap gap-2">
            {["all", "panels", "inverters", "batteries", "accessories"].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl border text-[10px] uppercase font-black transition-all cursor-pointer ${
                  categoryFilter === cat 
                    ? "bg-slate-900 border-slate-900 text-white" 
                    : "bg-white border-[#E2E8F0] text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>

          {/* BENTO CATALOG GRID */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map(prod => (
              <div 
                key={prod.id} 
                className={`bg-white border p-6 rounded-[24px] shadow-sm flex flex-col justify-between relative space-y-4 ${
                  prod.stock < 10 ? "border-rose-200 ring-1 ring-rose-50" : "border-[#E2E8F0]"
                }`}
              >
                {prod.stock < 10 && (
                  <span className="absolute top-4 right-4 bg-rose-50 text-rose-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 border border-rose-100">
                    <AlertTriangle className="h-3 w-3" /> LOW STOCK
                  </span>
                )}

                <div className="space-y-2">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">{prod.category}</span>
                  <h4 className="text-xs font-black text-slate-900 leading-snug">{prod.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Supplier: {prod.supplier}</p>
                </div>

                {/* Specs list */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50 space-y-1.5 text-[10px] font-medium text-slate-500">
                  {Object.entries(prod.specs || {}).slice(0, 2).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-400 font-extrabold uppercase text-[8px]">{k}</span>
                      <span className="text-slate-800 font-semibold">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Price and Stock Adjuster */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase block">Retail Pricing (₦)</span>
                    {editingPriceId === prod.id ? (
                      <div className="flex items-center gap-1 mt-0.5" onClick={e => e.stopPropagation()}>
                        <input
                          type="number"
                          className="w-20 p-1 border border-[#0057B8] rounded text-[11px] font-black focus:outline-none"
                          value={tempPrice}
                          onChange={e => setTempPrice(Number(e.target.value))}
                        />
                        <button
                          onClick={() => {
                            onUpdateProductPrice(prod.id, tempPrice);
                            setEditingPriceId(null);
                          }}
                          className="p-1 bg-[#00A651] text-white rounded cursor-pointer"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 mt-0.5 group">
                        <span className="font-black text-slate-900">₦{(prod.price / 1000).toFixed(0)}k</span>
                        <button
                          onClick={() => {
                            setEditingPriceId(prod.id);
                            setTempPrice(prod.price);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-100 rounded text-[#0057B8] transition cursor-pointer"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase block">Stock Units</span>
                    <span className={`font-black text-xs block mt-0.5 ${prod.stock < 10 ? "text-rose-600" : "text-slate-900"}`}>{prod.stock} left</span>
                  </div>
                </div>

                <div className="text-right pt-2" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => onDeleteProduct(prod.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer text-xs flex items-center justify-end w-full gap-1.5 font-bold uppercase tracking-wider"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Dismount</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ORDERS MANAGEMENT VIEW */
        <div className="bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">ID & Buyer Client</th>
                  <th className="py-4 px-6">Valuation Amount</th>
                  <th className="py-4 px-6">Fulfillment Fleet</th>
                  <th className="py-4 px-6">Order Status</th>
                  <th className="py-4 px-6">Payment Ledger</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-xs">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <h4 className="font-black text-slate-900">{order.customer}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block">{order.id} ● {order.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900">₦{order.amount.toLocaleString()}</td>
                    <td className="py-4 px-6 font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Truck className="h-4 w-4 text-slate-400" />
                        <span>{order.carrier}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        className="p-1.5 border border-[#E2E8F0] rounded-xl text-[10px] font-black uppercase text-slate-700 bg-white"
                        value={order.status}
                        onChange={e => onUpdateOrderStatus(order.id, e.target.value as any)}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${
                        order.payStatus === "Paid" ? "bg-emerald-500/10 text-[#00A651]" : "bg-amber-500/10 text-amber-600"
                      }`}>
                        ● {order.payStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => alert(`Tracking Number: ${order.trackingNumber || "N/A"}`)}
                        className="px-3 py-1.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                      >
                        Track Shipment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] max-w-lg w-full p-8 shadow-2xl space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Onboard Certified Hardware</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded-full transition">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-400">Equipment Name / Spec Code</label>
                <input
                  type="text"
                  placeholder="e.g. TAPCO Monocrystalline 600W Panel"
                  className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                  value={newProd.name}
                  onChange={e => setNewProd(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Inventory Category</label>
                  <select
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs bg-white focus:outline-none"
                    value={newProd.category}
                    onChange={e => setNewProd(prev => ({ ...prev, category: e.target.value as any }))}
                  >
                    <option value="panels">Solar Panels</option>
                    <option value="inverters">Hybrid Inverters</option>
                    <option value="batteries">Lithium Powerwalls</option>
                    <option value="accessories">Grid Accessories</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Supplier Enterprise</label>
                  <input
                    type="text"
                    placeholder="e.g. JA Solar, Synsynk"
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                    value={newProd.supplier}
                    onChange={e => setNewProd(prev => ({ ...prev, supplier: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Direct Procurement Unit Price (₦)</label>
                  <input
                    type="number"
                    placeholder="Valuation Naira"
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                    value={newProd.price}
                    onChange={e => setNewProd(prev => ({ ...prev, price: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Initial Warehouse Stock Unit Buffer</label>
                  <input
                    type="number"
                    placeholder="Starting units"
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                    value={newProd.stock}
                    onChange={e => setNewProd(prev => ({ ...prev, stock: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!newProd.name) return;
                onAddProduct({
                  name: newProd.name,
                  category: newProd.category,
                  price: newProd.price,
                  stock: newProd.stock,
                  supplier: newProd.supplier,
                  specs: { "Origin": "Fulfillment Warehouse" }
                });
                setShowAddModal(false);
                setNewProd({ name: "", category: "panels", price: 350000, stock: 20, supplier: "JA Solar Ltd" });
              }}
              className="w-full rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 py-3 text-xs font-bold uppercase text-white transition shadow-lg"
            >
              Dispatch Stock Registry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
