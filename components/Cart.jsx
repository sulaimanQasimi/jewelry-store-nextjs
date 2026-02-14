import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'
import Barcode from "react-barcode";

const Cart = ({paidAmount , setPaidAmount}) => {

  const { cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  } = useCart()



  if (cart.length === 0) {
    return;
  }
  console.log("the cart is:",cart)

  return (
    <div className="mt-6">
      <div className="card-luxury overflow-hidden rounded-2xl">
        <ul className="grid grid-cols-[5fr_5fr_2fr_2fr_3fr_4fr_8fr_8fr_2fr] text-charcoal text-sm font-medium">
          <li className="py-3 px-2 bg-charcoal text-white border-l border-white/10">نام جنس</li>
          <li className="py-3 px-2 bg-charcoal text-white border-l border-white/10">نوعیت جنس</li>
          <li className="py-3 px-2 bg-charcoal text-white border-l border-white/10">وزن</li>
          <li className="py-3 px-2 bg-charcoal text-white border-l border-white/10">عیار</li>
          <li className="py-3 px-2 bg-charcoal text-white border-l border-white/10">فروش</li>
          <li className="py-3 px-2 bg-charcoal text-white border-l border-white/10">واحد پول</li>
          <li className="py-3 px-2 bg-charcoal text-white border-l border-white/10">عکس</li>
          <li className="py-3 px-2 bg-charcoal text-white border-l border-white/10">بارکود</li>
          <li className="py-3 px-2 bg-charcoal text-white">#</li>
        </ul>
        {cart.map((product, index) => (
          <ul key={index} className="grid grid-cols-[5fr_5fr_2fr_2fr_3fr_4fr_8fr_8fr_2fr] text-center justify-center items-center text-charcoal text-xs border-b border-gold-100 last:border-0 hover:bg-champagne/40 transition-colors">
            <li className="py-6 px-2 border-l border-gold-100">{product.productName}</li>
            <li className="py-6 px-2 border-l border-gold-100">{product.type}</li>
            <li className="py-6 px-2 border-l border-gold-100">{product.gram}</li>
            <li className="py-6 px-2 border-l border-gold-100">{product.karat}</li>
            <li className="py-6 px-2 border-l border-gold-100">{product.salePrice}</li>
            <li className="py-6 px-2 border-l border-gold-100">{product.saleCurrency}</li>
            <li className="py-2 px-2 border-l border-gold-100 flex justify-center">
              {product.image ? <img className="w-32 h-20 object-cover rounded-lg border border-gold-200" src={`http://localhost:3000/${product.image}`} alt="" /> : <span className="text-charcoal-soft">—</span>}
            </li>
            <li className="px-2 py-2 border-l border-gold-100 flex justify-center min-h-[5rem] items-center">
              <Barcode value={product.barcode} format="CODE128" width={0.8} height={50} displayValue={true} fontSize={14} margin={2} />
            </li>
            <li className="py-2 flex justify-center">
              <button type="button" className="p-1.5 rounded-[8px] text-rosegold hover:bg-gold-100 transition-all duration-300" onClick={() => removeFromCart(product._id)} aria-label="حذف">✕</button>
            </li>
          </ul>
        ))}
        <div className="grid grid-cols-[3fr_5fr_3fr] text-center items-center justify-center text-sm bg-gold-50 border-t-2 border-gold-200">
          <div className="flex flex-col py-3 px-4 border-l border-gold-200">
            <label className="text-charcoal-soft text-xs font-medium">مجموع پول</label>
            <p className="text-gold-700 font-semibold mt-0.5">{getTotalPrice()}</p>
          </div>
          <div className="flex flex-col py-3 px-4 border-l border-gold-200">
            <label className="text-charcoal-soft text-xs font-medium">تعداد جنس</label>
            <p className="text-gold-700 font-semibold mt-0.5">{getTotalItems()}</p>
          </div>
          <div className="flex flex-col py-3 px-4 justify-center">
            <button type="button" onClick={clearCart} className="btn-luxury btn-luxury-outline py-2 px-4 w-full max-w-[8rem] mx-auto">
              پاک کردن
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
