import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const CurrencyExchange = ({ isCurrencyToggle }) => {

    const [isCurrencyToggleOn, setIsCurrencyToggleOn] = useState(false)
    const [loading , setLoading] = useState(false)
    const { rate, setRate, saved, setSaved, saveRate, backendUrl } = useContext(AppContext)

    const fetchTodayRate = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/currency/today')

            if (data?.rate) {
                setRate(data.rate.usdToAfn)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const handleSave = async()=>{
        
        if(!rate) return toast.error("نرخ را وارد کنید")

        try {
            setLoading(true)
            const {data} = await axios.post(backendUrl+'/api/currency/today' , {usdToAfn: Number(rate)})

            if(data.success){
                toast.success("نرخ امروز ثبت شد")
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchTodayRate()
    },[])

    const currencyToggleChange = (e) => {
        e.preventDefault()
        setIsCurrencyToggleOn(!isCurrencyToggleOn)
    }


    return (
        <div className='relative'>
            <img className='w-10 hover:scale-120 transition-all duration-500' src={assets.exchange_currency_icon} alt="" onClick={(e) => currencyToggleChange(e)} />
            <div className={`absolute transition-all duration-500 w-md shadow-2xl rounded-lg shadow-gray-900 ${isCurrencyToggleOn ? 'top-16 -right-48' : "-top-80 -right-48"}`}>
                <div className='max-w-md bg-white p-6 rounded-xl shadow-sm'>
                    <h2 className='text-lg font-semibold mb-4 text-gray-800'>تعیین نرخ دالر</h2>
                    <div>
                        <div>
                            <label htmlFor="">نرخ فعلی دالر</label>
                            <input type="number" step='0.01' value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || "")} className='w-full bg-blue-600 outline-none text-white px-2 py-1.5 rounded-lg transition-all' />
                        </div>
                        <div className='flex justify-center text-white mt-4 gap-4 text-sm'>
                            <button onClick={() => setIsCurrencyToggleOn(false)} className='w-28 bg-red-500 rounded cursor-pointer py-1'>کنسل</button>
                            <button onClick={handleSave} className='w-28 bg-blue-600 rounded cursor-pointer py-1'>ذخیره نرخ</button>
                        </div>
                         <div className='mt-6 text-green-500 text-center'>
                           {loading ? <p>در حال ذخیره</p>:<p></p>} 
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CurrencyExchange
