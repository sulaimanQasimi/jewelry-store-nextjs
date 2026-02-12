import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const StorageRate = () => {

    const [isCurrencyToggleOn, setIsCurrencyToggleOn] = useState(false)
    const [loading, setLoading] = useState(false)
    const { usdRate , setUsdRate , afnRate , setAfnRate, saved, setSaved, saveStorageRate, backendUrl } = useContext(AppContext)

    const fetchTodayRate = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/storage/get')

            if (data.success) {
                console.log(data)
                setUsdRate(data.storage.usd)
                setAfnRate(data.storage.afn)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const handleSave = async () => {

        if (!usdRate || !afnRate) return toast.error("دخل امروز را وارد")

        try {
            setLoading(true)
            const { data } = await axios.post(backendUrl + '/api/storage/set', { usd: Number(usdRate) , afn:Number(afnRate) })

            if (data.success) {
                toast.success("دخل امروز ثبت شد")
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTodayRate()
    }, [])

    const currencyToggleChange = (e) => {
        e.preventDefault()
        setIsCurrencyToggleOn(!isCurrencyToggleOn)
    }


    return (
        <div className='relative'>
            <img className='w-10 hover:scale-120 transition-all duration-500' src={assets.exchange_currency_icon} alt="" onClick={(e) => currencyToggleChange(e)} />
            <div className={`absolute transition-all duration-500 w-md shadow-2xl rounded-lg shadow-gray-900 ${isCurrencyToggleOn ? 'top-16 -right-48' : "-top-80 -right-48"}`}>
                <div className='max-w-md bg-white p-6 rounded-xl shadow-sm'>
                    <h2 className='text-lg font-semibold mb-4 text-gray-800'>موجودی دخل</h2>
                    <div>

                        <div>
                            <label htmlFor="">دخل دالر</label>
                            <input type="number" step='0.01' value={usdRate} onChange={(e) => setUsdRate(parseFloat(e.target.value) || "")} className='w-full bg-blue-600 outline-none text-white px-2 py-1.5 rounded-lg transition-all' />
                        </div>

                        <div>
                            <label htmlFor="">دخل افغانی</label>
                            <input type="number" step='0.01' value={afnRate} onChange={(e) => setAfnRate(parseFloat(e.target.value) || "")} className='w-full bg-blue-600 outline-none text-white px-2 py-1.5 rounded-lg transition-all' />
                        </div>
                        <div className='flex justify-center text-white mt-4 gap-4 text-sm'>
                            <button onClick={() => setIsCurrencyToggleOn(false)} className='w-28 bg-red-500 rounded cursor-pointer py-1'>کنسل</button>
                            <button onClick={handleSave} className='w-28 bg-blue-600 rounded cursor-pointer py-1'>ذخیره دخل</button>
                        </div>
                        <div className='mt-6 text-green-500 text-center'>
                            {loading ? <p>در حال ذخیره</p> : <p></p>}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default StorageRate
