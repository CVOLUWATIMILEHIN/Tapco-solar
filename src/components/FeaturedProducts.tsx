import React, { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useCMS } from "../context/CMSContext";
import { Product } from "../types";
import { motion } from "motion/react";

interface FeaturedProductsProps {
  onAddToCart: (prod: Product) => void;
  onExploreStoreClick: () => void;
}

export default function FeaturedProducts({ onAddToCart, onExploreStoreClick }: FeaturedProductsProps) {
  const { productsList } = useCMS();
  const [products, setProducts] = useState<Product[]>(productsList as any);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    setProducts(productsList as any);
  }, [productsList]);

  useEffect(() => {
    let active = true;
    fetch("/api/solar-prices")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Received non-JSON response from server");
        }
        return res.json();
      })
      .then((data) => {
        if (active && data.success && data.products) {
          setExchangeRate(data.exchangeRate);
          const updated = (productsList as any).map((p: any) => {
            const apiProd = data.products.find((ap: any) => ap.id === p.id);
            return apiProd ? { ...p, price: apiProd.price } : p;
          });
          setProducts(updated);
        }
      })
      .catch((err) => {
        console.warn("Gracefully falling back to cached products data:", err.message || err);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="featured-products-section" className="w-full bg-slate-50 border-b border-slate-100 py-12 sm:py-16 md:py-20 scroll-mt-24">
      <div className="max-w-[95%] xl:max-w-[92%] 2xl:max-w-[90%] mx-auto w-full px-6 md:px-12 lg:px-16 xl:px-20 space-y-16">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          {exchangeRate ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#00A651]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00A651] animate-pulse" />
              Live Pricing (₦{exchangeRate.toLocaleString()}/USD)
            </div>
          ) : (
            <span className="text-xs font-black uppercase tracking-widest text-[#00A651] block">Direct Procurement E-Store</span>
          )}
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Premium Certified Solar Equipment</h3>
          <p className="text-sm md:text-base text-slate-500 font-medium">Acquire verified authentic solar modules, lithium powerwalls, and inverters with localized warranties.</p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((prod, idx) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="rounded-3xl border border-slate-100 bg-white overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300"
            >
              <div className="relative overflow-hidden h-60 bg-slate-50 flex items-center justify-center p-6">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover rounded-2xl hover:scale-102 transition-transform duration-300" />
                <span className="absolute top-4 left-4 text-[9px] uppercase font-black tracking-widest bg-[#0057B8] text-white px-2.5 py-1 rounded-md">
                  {prod.category}
                </span>
              </div>
              <div className="p-8 space-y-5 flex-1 flex flex-col justify-between text-left">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-base md:text-lg font-black text-slate-900 leading-snug">{prod.name}</h4>
                    <span className="text-base font-black font-mono text-[#0057B8] whitespace-nowrap">₦{prod.price.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{prod.specs.manufacturer || "TAPCO Certified"}</p>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">{prod.description}</p>
                </div>
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-[#00A651] font-black uppercase tracking-widest flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#00A651] animate-pulse"></span>
                    In Stock - Lagos Hub
                  </span>
                  <button
                    onClick={() => {
                      onAddToCart(prod);
                    }}
                    className="rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/90 text-white font-black px-4 py-2.5 text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onExploreStoreClick}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 px-6 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>Browse Full E-Store Catalogue</span>
            <ShoppingBag className="h-4 w-4 text-[#00A651]" />
          </button>
        </div>
      </div>
    </section>
  );
}
