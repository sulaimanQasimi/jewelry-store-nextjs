import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const SideBar = () => {

    const navigate = useNavigate()


    return (
        <div className=' w-12 flex flex-col gap-6 px-2 py-4 bg-linear-to-r bg-cyan-900 backdrop-blur-md'>
            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={() => navigate('/sale-product')} className='w-7' src={assets.jewelery_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded z-20'>
                    <p>فروش جنس</p>
                </div>

            </div>

            {/* <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/buy-product')} className='w-7' src={assets.buy_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>خرید جنس از مشتری</p>
                </div>
            </div> */}

            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/product-from-supplier')} className='w-7' src={assets.buy_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>خرید جنس از تمویل کننده</p>
                </div>
            </div>

            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/add-fragment')} className='w-7' src={assets.broken_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>خرید شکسته</p>
                </div>
            </div>

            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/ware-house')} className='w-7' src={assets.warehouse_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>انبار</p>
                </div>
            </div>

            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/expenses')} className='w-7' src={assets.money_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>مصارف</p>
                </div>
            </div>

            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/loan-management')} className='w-7' src={assets.loan_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>بلانس مشتریان</p>
                </div>
            </div>
{/* 
            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/employee')} className='w-7' src={assets.employee_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>کارمندان</p>
                </div>
            </div> */}

            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/register-product')} className='w-7' src={assets.fragment_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>ثبت اجناس شکسته</p>
                </div>
            </div>

            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/register-supplier-product')} className='w-7' src={assets.new_product_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>ثبت اجناس</p>
                </div>
            </div>

            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/customer-registration')} className='w-7' src={assets.client_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>ثبت مشتریان</p>
                </div>
            </div>

            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/new-trade')} className='w-7' src={assets.trader_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>معامله داران</p>
                </div>
            </div>

            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/daily-report')} className='w-7' src={assets.daily_report} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>گزارش یومیه</p>
                </div>
            </div>

            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/report')} className='w-7' src={assets.report_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>گزارشات</p>
                </div>
            </div>

            <div className='group relative cursor-pointer' >
                <div className='flex gap-4 items-center'><img onClick={()=>navigate('/company-information')} className='w-7' src={assets.info_icon} alt="" /></div>
                <div className='absolute right-8 top-1 hidden group-hover:block bg-black text-white py-0.5 px-2 text-center rounded'>
                    <p>درباره ما</p>
                </div>
            </div>

        </div>
    )
}

export default SideBar
