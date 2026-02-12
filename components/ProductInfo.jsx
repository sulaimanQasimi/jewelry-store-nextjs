import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import BuyCartPriceModel from "./BuyCartPriceModel";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded flex flex-col items-center relative">
        <img onClick={()=>setIsProductOn(false)} src={assets.cancel_icon} className="absolute w-6 right-2 top-2 cursor-pointer" alt="" />
        <h2 className="mb-4 text-lg font-semibold">مشخصات محصول</h2>

        {/* search input */}
        <div className="flex flex-col gap-1 relative w-72">
          <label>اسم جنس</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-2 py-1"
            placeholder="نام جنس را بنویسید"
          />

          {loading && (
            <div className="absolute top-full bg-white p-2 text-sm border w-full">
              در حال جستجو...
            </div>
          )}

          {products.length > 0 && (
            <div className="absolute top-full bg-white border w-full z-10">
              {products.map((p) => (
                <div
                  key={p._id}
                  onClick={() => {
                    setSelectedProduct(p); // ✅ پر کردن state محلی
                    setSearch(p.name);
                    setProducts([]);
                    onSelect?.(p); // اطلاع والد (اختیاری)
                  }}
                  className="p-2 cursor-pointer border-b hover:bg-gray-100"
                >
                  <p className="flex gap-2"><span>{p.name}</span> - <span className="text-gray-500">{p.type}</span></p>
                  <p className="flex gap-4"><span className="text-gray-500">{p.gram} - گرام</span>  <span className="text-gray-500">{p.karat} - عیار</span></p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* price & quantity */}
        {selectedProduct && (
          <div className="w-full mt-6 bg-indigo-500/80 p-3 rounded">
            <BuyCartPriceModel
              product={selectedProduct} // ✅ درست
              setIsProductOn={setIsProductOn}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
