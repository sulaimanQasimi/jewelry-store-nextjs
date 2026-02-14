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

    return (
        <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-10">
            <div className="card-luxury p-6 rounded-2xl w-full max-w-sm shadow-[0_24px_48px_-12px_rgba(28,28,28,0.18)]">
                <div className="mb-5">
                    <h2 className="font-heading font-semibold text-charcoal dark:text-white mb-1">
                        {product.productName} – {product.type}
                    </h2>
                    <p className="text-sm text-charcoal-soft dark:text-slate-400 mb-3">
                        {parseFloat(product.purchasePriceToAfn).toFixed(0)} افغانی
                    </p>
                    {product.image && (
                        <img src={product.image.startsWith('http') ? product.image : `/${product.image}`} alt="" className="rounded-xl border border-gold-200 dark:border-slate-600 object-cover max-h-32 w-full" />
                    )}
                </div>

                <div className="space-y-3 mb-5">
                    <label className="block text-sm font-medium text-charcoal dark:text-slate-200">قیمت فروش</label>
                    <input
                        type="text"
                        placeholder="قیمت فروش"
                        value={price}
                        inputMode="numeric"
                        onChange={(e) => setPrice(convertToEnglish(e.target.value))}
                        className="input-luxury w-full"
                    />
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-charcoal dark:text-slate-200 mb-1">واحد پول</label>
                        <select id="currency" onChange={(e) => setCurrency(e.target.value)} value={currency} className="input-luxury w-full cursor-pointer dark:bg-slate-800 dark:text-white">
                            <option value="" className="dark:bg-slate-800">واحد پول</option>
                            <option value="افغانی" className="dark:bg-slate-800">افغانی</option>
                            <option value="دالر" className="dark:bg-slate-800">دالر</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="btn-luxury btn-luxury-outline px-4 py-2">
                        لغو
                    </button>
                    <button type="button" onClick={handleSubmit} className="btn-luxury btn-luxury-primary px-4 py-2">
                        ثبت
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PriceModal;
