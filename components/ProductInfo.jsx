import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import BuyCartPriceModel from "./BuyCartPriceModel";
import { AppContext } from '@/lib/context/AppContext'

const ProductInfo = ({ setIsProductOn, onSelect }) => {
  const { backendUrl } = useContext(AppContext);

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  console.log('product is ',products)

  const fetchProductMaster = async () => {
    const { data } = await axios.get(
      `${backendUrl}/api/product-master/get?search=${search}`
    );
    return data;
  };

  useEffect(() => {
    if (!search.trim()) {
      setProducts([]);
      setSelectedProduct(null);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await fetchProductMaster();
        if (data.success) {
          setProducts(data.productMaster || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-luxury bg-white p-6 md:p-8 rounded-2xl flex flex-col items-center relative max-w-md w-full shadow-[0_24px_48px_-12px_rgba(28,28,28,0.18)]">
        <button type="button" onClick={() => setIsProductOn(false)} className="absolute w-9 h-9 right-3 top-3 rounded-[10px] flex items-center justify-center text-charcoal-soft hover:bg-gold-100 hover:text-charcoal transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-300">
          <img src="/assets/cancel.png" className="w-5 h-5" alt="" />
        </button>
        <h2 className="font-heading mb-5 text-xl font-semibold text-charcoal">مشخصات محصول</h2>

        <div className="flex flex-col gap-2 relative w-full max-w-[18rem]">
          <label className="text-sm font-medium text-charcoal">اسم جنس</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-luxury w-full"
            placeholder="نام جنس را بنویسید"
          />

          {loading && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white p-3 text-sm rounded-[10px] border border-gold-200 shadow-[0_4px_20px_-4px_rgba(28,28,28,0.1)] z-20">
              در حال جستجو...
            </div>
          )}

          {products.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[10px] border border-gold-200 shadow-[0_4px_20px_-4px_rgba(28,28,28,0.1)] overflow-hidden z-20 max-h-60 overflow-y-auto">
              {products.map((p) => (
                <div
                  key={p._id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setSearch(p.name);
                    setProducts([]);
                    onSelect?.(p);
                  }}
                  className="p-3 cursor-pointer border-b border-gold-100 last:border-0 hover:bg-champagne/80 transition-colors duration-200"
                >
                  <p className="flex gap-2 text-charcoal"><span className="font-medium">{p.name}</span> – <span className="text-charcoal-soft">{p.type}</span></p>
                  <p className="flex gap-4 mt-0.5 text-sm text-charcoal-soft">{p.gram} گرام · {p.karat} عیار</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedProduct && (
          <div className="w-full mt-6 bg-gradient-to-br from-gold-100 to-champagne/80 p-4 rounded-xl border border-gold-200/60">
            <BuyCartPriceModel
              product={selectedProduct}
              setIsProductOn={setIsProductOn}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
