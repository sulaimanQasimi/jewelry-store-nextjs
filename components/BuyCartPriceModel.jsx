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
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex flex-col gap-1">
          <label className="text-white">قیمت</label>
          <input
            type="text"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(convertToEnglish(e.target.value))}
            placeholder="قیمت فی عدد"
            className="border bg-gray-100 rounded py-1 px-2 w-52"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white">تعداد</label>
          <input
            type="text"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => setQuantity(convertToEnglish(e.target.value))}
            placeholder="تعداد"
            className="border bg-gray-100 rounded py-1 px-2 w-52"
          />
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setIsProductOn(false)}
          className="bg-red-600 w-28 text-white rounded py-1"
        >
          لغو
        </button>

        <button
          onClick={handleToAddCart}
          className="bg-sky-600 w-28 text-white rounded py-1"
        >
          ثبت
        </button>
      </div>
    </div>
  );
};

export default BuyCartPriceModel;
