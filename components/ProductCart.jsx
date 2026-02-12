import { toast } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useCart } from "../context/CartContext";

const ProductCart = ({ product }) => {
  const { setCart } = useCart();
  const { backendUrl } = useContext(AppContext);

  const updateIsSold = async (id, value) => {
    if (product.isSold === value) {
      toast.warn("وضعیت قبلاً ثبت شده");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/product/${id}/sold`,
        { isSold: value }
      );

      if (data.success) {
        toast.success(data.message);

        setCart((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, isSold: value } : p
          )
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <button
        onClick={() => updateIsSold(product._id, true)}
        className="bg-sky-700 text-white py-1 px-3 rounded mt-2"
      >
        ثبت فروش
      </button>
    </div>
  );
};

export default ProductCart;
