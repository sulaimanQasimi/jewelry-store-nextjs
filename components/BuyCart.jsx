import React, { useContext } from 'react'
import { useBuyCart } from '../context/BuyProductContext'

const BuyCart = () => {

    const { buyCart , removeFromCart , getTotalPrice, getTotalItems} = useBuyCart()
    console.log("cart is :",buyCart)

    return (
        <div className="mt-8">
            <div className="card-luxury overflow-hidden rounded-2xl">
                <div className="grid grid-cols-[1fr_5fr_1fr_1fr_1fr_1fr] justify-center text-center text-sm font-medium">
                    <p className="bg-charcoal text-white py-3 px-2">شماره</p>
                    <div className="grid grid-cols-4">
                        <p className="bg-charcoal text-white py-3 px-2 border-r border-white/10">اسم جنس</p>
                        <p className="bg-charcoal text-white py-3 px-2 border-r border-white/10">نوعیت جنس</p>
                        <p className="bg-charcoal text-white py-3 px-2 border-r border-white/10">عیار</p>
                        <p className="bg-charcoal text-white py-3 px-2">وزن</p>
                    </div>
                    <p className="bg-charcoal text-white py-3 px-2 border-r border-white/10">فیات</p>
                    <p className="bg-charcoal text-white py-3 px-2 border-r border-white/10">تعداد</p>
                    <p className="bg-charcoal text-white py-3 px-2 border-r border-white/10">مجموع</p>
                    <p className="bg-charcoal text-white py-3 px-2">ویرایش</p>
                </div>

                <div>
                    {buyCart.map((item, index) => (
                        <ul key={index} className="grid grid-cols-[1fr_5fr_1fr_1fr_1fr_1fr] justify-center text-center text-charcoal border-b border-gold-100 last:border-0 transition-colors hover:bg-champagne/50">
                            <li className="py-3 px-2 border-l border-gold-100">{index + 1}</li>
                            <div className="grid grid-cols-4">
                                <li className="py-3 px-2 border-l border-gold-100">{item.product.name}</li>
                                <li className="py-3 px-2 border-l border-gold-100">{item.product.type}</li>
                                <li className="py-3 px-2 border-l border-gold-100">{item.product.gram}</li>
                                <li className="py-3 px-2 border-l border-gold-100">{item.product.karat}</li>
                            </div>
                            <li className="py-3 px-2 border-l border-gold-100">{item.price}</li>
                            <li className="py-3 px-2 border-l border-gold-100">{item.quantity}</li>
                            <li className="py-3 px-2 border-l border-gold-100">{item.price * item.quantity}</li>
                            <li className="py-3 px-2 flex justify-center items-center">
                                <button type="button" onClick={() => removeFromCart(item._id)} className="p-1.5 rounded-[8px] text-rosegold hover:bg-gold-100 transition-all duration-300" aria-label="حذف">
                                    <img src="/assets/delete.png" className="w-5 h-5" alt="" />
                                </button>
                            </li>
                        </ul>
                    ))}
                </div>

                <div className="grid grid-cols-4 text-center bg-gold-50 border-t-2 border-gold-200">
                    <div className="py-3 px-4 font-medium text-charcoal border-l border-gold-200">مجموع کل</div>
                    <div className="py-3 px-4 text-gold-700 font-semibold border-l border-gold-200">{getTotalPrice()}</div>
                    <div className="py-3 px-4 font-medium text-charcoal border-l border-gold-200">تعداد اقلام</div>
                    <div className="py-3 px-4 text-gold-700 font-semibold">{getTotalItems()}</div>
                </div>
            </div>
        </div>
    )
}

export default BuyCart
