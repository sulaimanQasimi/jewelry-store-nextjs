import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from '@/lib/context/AppContext'
import PriceModal from "./PriceModel";
import { Search } from 'lucide-react';

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
      <div className="flex items-center gap-2 relative">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(convertToEnglish(e.target.value))}
          onKeyDown={handleKeyDown}
          type="text"
          className="input-luxury flex-1 pl-12"
          placeholder="جستجوی جنس بر اساس بارکود"
          inputMode="numeric"
        />
        <button
          type="button"
          onClick={() => query && fetchData(query)}
          className="absolute left-1 top-1 bottom-1 p-2 rounded-lg bg-gold-500 text-white hover:bg-gold-600 transition-all duration-300 flex items-center justify-center"
          aria-label="جستجو"
        >
          <Search className="w-5 h-5" />
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
