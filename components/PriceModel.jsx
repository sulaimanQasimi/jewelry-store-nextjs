import { useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const PriceModal = ({ product, onClose }) => {
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("")
    const { addToCart } = useCart();

    const convertToEnglish = (str) => {
        const map = {
            "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
            "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
            "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
            "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9"
        };
        return str.replace(/[۰-۹٠-٩]/g, d => map[d]);
    };

    const handleSubmit = () => {
        if (!price || Number(price) <= 0) {
            return toast.warn("قیمت معتبر وارد کن");
        }

        if (product.isSold) {
            return toast.error("این محصول قبلاً فروخته شده");
        }

        if (currency === "") {
            return toast.error("لطفا واحد پول را انتخاب کنید")
        }

        addToCart(product, Number(price), currency);
        toast.success("محصول به سبد خرید اضافه شد");
        onClose();
    };
    console.log(product)

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded w-80">
                <div className="py-4">
                    <h2 className="font-bold mb-3">
                        {product.productName} -{product.type}
                    </h2>
                    <h2 className="font-bold mb-3">
                        {parseFloat(product.purchasePriceToAfn).toFixed(0)} - افغانی
                    </h2>

                    <img src={`http://localhost:3000/${product.image}`} alt="" />
                </div>

                <input
                    type="text"
                    placeholder="قیمت فروش"
                    value={price}
                    inputMode="numeric"
                    onChange={(e) => setPrice(convertToEnglish(e.target.value))}
                    className="border w-full p-2 mb-3"
                />
                <div>
                    <label htmlFor="currency"></label>
                    <select onChange={(e) => setCurrency(e.target.value)} name="" id="currency">
                        <option value="">واحد پول</option>
                        <option value="افغانی">افغانی</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 border rounded"
                    >
                        لغو
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                        ثبت
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PriceModal;
