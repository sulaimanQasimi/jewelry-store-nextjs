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
    <div >
      <div className='mt-4'>
        <ul className='grid grid-cols-[5fr_5fr_2fr_2fr_3fr_4fr_8fr_8fr_2fr] text-gray-700 text-sm '>
          <li className='py-2 px-2 bg-gray-300 border border-gray-100'>نام جنس</li>
          <li className='py-2 px-2 bg-gray-300 border border-gray-100'>نوعیت جنس</li>
          <li className='py-2 px-2 bg-gray-300 border border-gray-100'>وزن</li>
          <li className='py-2 px-2 bg-gray-300 border border-gray-100'>عیار</li>
          <li className='py-2 px-2 bg-gray-300 border border-gray-100'>فروش</li>
          <li className='py-2 px-2 bg-gray-300 border border-gray-100'>واحد پول</li>
          <li className='py-2 px-2 bg-gray-300 border border-gray-100'>عکس</li>
          <li className='py-2 px-2 bg-gray-300 border border-gray-100'>بارکود</li>
          <li className='py-2 px-2 bg-gray-300 border border-gray-100'>#</li>
        </ul>
        {cart.map((product, index) => (
          <div className='' key={index}>
            <ul key={index} className='grid grid-cols-[5fr_5fr_2fr_2fr_3fr_4fr_8fr_8fr_2fr] text-center justify-center items-center text-gray-700 text-xs'>
              <li className='py-10 px-2 border border-gray-300'>{product.productName}</li>
              <li className='py-10 px-2 border border-gray-300'>{product.type}</li>
              <li className='py-10 px-2 border border-gray-300'>{product.gram}</li>
              <li className='py-10 px-2 border border-gray-300'>{product.karat}</li>
              <li className='py-10 px-2 border border-gray-300'>{product.salePrice}</li>
              <li className='py-10 px-2 border border-gray-300'>{product.saleCurrency}</li>
              <li><img className={` ${product.image ? 'w-40 h-24 object-cover' : 'hidden'}`} src={`http://localhost:3000/${product.image}`} alt="" /></li>
              <li className='px-2 border h-24 border-gray-300 flex justify-center'><Barcode
                value={product.barcode}
                format="CODE128"
                width={0.8}
                height={50}
                displayValue={true}
                fontSize={16}
                margin={2}
              /></li>
              <li><button className='text-red-500 cursor-pointer' onClick={() => removeFromCart(product._id)}>X</button></li>
            </ul>
          </div>))}
        {/* ---- Manipulate Button ---- */}
        <div className='grid grid-cols-[3fr_5fr_3fr] text-center items-center justify-center text-sm'>

          <div className='flex flex-col border border-gray-300'>
            <label className='text-gray-500' htmlFor="">مجموع پول</label>
            <p className='text-green-600'>{getTotalPrice()}</p>
          </div>

          <div className='flex flex-col border border-gray-300'>
            <label className='text-gray-500' htmlFor="">تعداد جنس</label>
            <p className='text-green-600'>{getTotalItems()}</p>
          </div>

          <div className='flex flex-col border border-gray-300 py-2.5 px-4'>
            <button  onClick={clearCart} className='bg-teal-700 text-white rounded'>پاک کردن</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart
