import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from '@/lib/context/AppContext'
import PriceModal from "./PriceModel";

const SearchProduct = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [showPriceModal, setShowPriceModal] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      fetchData(query);
    }
  };

  const fetchData = async (code) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/product/search-barcode/${code}`
      );

      if (!data.success) {
        toast.error("جنس پیدا نشد");
        setResult(null);
        return;
      }

      setResult(data.productByBarcode);
      setShowPriceModal(true);
      setQuery("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const convertToEnglish = (str) => {
    const map = {
      "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
      "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
      "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
      "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9"
    };
    return str.replace(/[۰-۹٠-٩]/g, d => map[d]);
  };

  return (
    <div className="max-w-sm">
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(convertToEnglish(e.target.value))}
          onKeyDown={handleKeyDown}
          type="text"
          className="input-luxury flex-1 py-2.5"
          placeholder="جستجوی جنس بر اساس بارکود"
          inputMode="numeric"
        />
        <button
          type="button"
          onClick={() => query && fetchData(query)}
          className="btn-luxury btn-luxury-primary p-2.5 rounded-[10px] flex items-center justify-center transition-all duration-300 hover:scale-105"
          aria-label="جستجو"
        >
          <img src="/assets/search.png" className="w-5 h-5 invert" alt="" />
        </button>
      </div>

      {showPriceModal && result && (
        <PriceModal
          product={result}
          onClose={() => setShowPriceModal(false)}
        />
      )}
    </div>
  );
};

export default SearchProduct;
