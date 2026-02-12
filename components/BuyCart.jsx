import React, { useContext } from 'react'
import { useBuyCart } from '../context/BuyProductContext'
import { assets } from '../assets/assets'

const BuyCart = () => {

    const { buyCart , removeFromCart , getTotalPrice, getTotalItems} = useBuyCart()
    console.log("cart is :",buyCart)

    return (
        <div className='mt-12'>
            <div className='flex flex-col'>
                <div className='grid grid-cols-[1fr_5fr_1fr_1fr_1fr_1fr] justify-center text-center font-meduim'>
                    <p className='border border-white bg-sky-700 text-white py-1'>شماره</p>
                    <div className='grid grid-cols-4'>
                        <p className='border border-white bg-sky-700 text-white py-1'>اسم جنس</p>
                        <p className='border border-white bg-sky-700 text-white py-1'>نوعیت جنس</p>
                        <p className='border border-white bg-sky-700 text-white py-1'>عیار</p>
                        <p className='border border-white bg-sky-700 text-white py-1'>وزن</p>
                    </div>
                    <p className='border border-white bg-sky-700 text-white py-1'>فیات</p>
                    <p className='border border-white bg-sky-700 text-white py-1'>تعداد</p>
                    <p className='border border-white bg-sky-700 text-white py-1'>مجموع</p>
                    <p className='border border-white bg-sky-700 text-white py-1'>ویرایش</p>
                </div>

                <div>
                    {buyCart.map((item, index) => (
                        <ul key={index} className='grid grid-cols-[1fr_5fr_1fr_1fr_1fr_1fr] justify-center text-center'>
                            <li className='text-gray-700 border border-gray-300 py-1'>{index + 1}</li>
                            <div className='grid grid-cols-4'>
                                <li className='text-gray-700 border border-gray-300 py-1'>{item.product.name}</li>
                                <li className='text-gray-700 border border-gray-300 py-1'>{item.product.type}</li>
                                <li className='text-gray-700 border border-gray-300 py-1'>{item.product.gram}</li>
                                <li className='text-gray-700 border border-gray-300 py-1'>{item.product.karat}</li>
                            </div>

                            <li className='text-gray-700 border border-gray-300 py-1'>{item.price}</li>
                            <li className='text-gray-700 border border-gray-300 py-1'>{item.quantity}</li>
                            <li className='text-gray-700 border border-gray-300 py-1'>{item.price * item.quantity}</li>
                            <li className='text-gray-700 border border-gray-300 py-1 flex justify-center cursor-pointer'><img onClick={()=>removeFromCart(item._id)}  src={assets.delete_icon} className='w-6' alt="" /></li>
                        </ul>
                    ))}
                </div>

                <div className=''>
                    <ul className='grid grid-cols-4 text-center'>
                        <li className='border border-gray-500'>مجموع کل</li>
                        <li className='border border-gray-500'>{getTotalPrice()}</li>
                        <li className='border border-gray-500'>تعداد اقلام</li>
                        <li className='border border-gray-500'>{getTotalItems()}</li>
                    </ul>
                </div>

            </div>
        </div>
    )
}

export default BuyCart
