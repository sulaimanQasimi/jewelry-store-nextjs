import React, { useState } from "react";
import { useBuyCart } from "../context/BuyProductContext";
import { toast } from "react-toastify";

const BuyCartPriceModel = ({ product, setIsProductOn }) => {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const { addToBuyCart } = useBuyCart();

  const handleToAddCart = () => {
    if (!product) {
      return toast.error("محصول انتخاب نشده است");
    }

    if (price === "") {
      return toast.error("قیمت محصول وارد نشده است");
    }

    if (quantity === "" || Number(quantity) <= 0) {
      return toast.error("تعداد محصول درست وارد نشده است");
    }

    addToBuyCart(product, Number(price), Number(quantity));
    toast.success("محصول به سبد خرید اضافه شد");
    setIsProductOn(false);
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
    <div className="py-2">
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-charcoal dark:text-white">قیمت</label>
          <input
            type="text"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(convertToEnglish(e.target.value))}
            placeholder="قیمت فی عدد"
            className="input-luxury w-52"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-charcoal dark:text-white">تعداد</label>
          <input
            type="text"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => setQuantity(convertToEnglish(e.target.value))}
            placeholder="تعداد"
            className="input-luxury w-52"
          />
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-5">
        <button type="button" onClick={() => setIsProductOn(false)} className="btn-luxury btn-luxury-outline w-28 py-2">
          لغو
        </button>
        <button type="button" onClick={handleToAddCart} className="btn-luxury btn-luxury-primary w-28 py-2">
          ثبت
        </button>
      </div>
    </div>
  );
};

export default BuyCartPriceModel;
