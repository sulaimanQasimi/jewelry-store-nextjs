import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/lib/context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Wallet } from 'lucide-react'

const StorageRate = () => {

    const [isCurrencyToggleOn, setIsCurrencyToggleOn] = useState(false)
    const [loading, setLoading] = useState(false)
    const { usdRate, setUsdRate, afnRate, setAfnRate, saved, setSaved, saveStorageRate, backendUrl } = useContext(AppContext)

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
            const { data } = await axios.post(backendUrl + '/api/storage/set', { usd: Number(usdRate), afn: Number(afnRate) })

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
        <div className="relative">
            <button type="button" onClick={(e) => currencyToggleChange(e)} className="p-2.5 rounded-xl text-slate-500 hover:bg-gold-50 hover:text-gold-600 transition-all duration-300 border border-transparent hover:border-gold-100" aria-label="موجودی دخل">
                <Wallet className="w-5 h-5" />
            </button>
            <div className={`absolute transition-all duration-300 ease-in-out z-50 min-w-[18rem] ${isCurrencyToggleOn ? 'top-14 -right-0 opacity-100 visible' : 'top-14 -right-0 opacity-0 invisible pointer-events-none'}`}>
                <div className="card-luxury p-6 rounded-2xl shadow-[0_12px_40px_-8px_rgba(28,28,28,0.15)] border border-gold-200/50">
                    <h2 className="font-heading text-lg font-semibold mb-4 text-charcoal">موجودی دخل</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-1">دخل دالر</label>
                            <input type="number" step="0.01" value={usdRate} onChange={(e) => setUsdRate(parseFloat(e.target.value) || "")} className="input-luxury w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-1">دخل افغانی</label>
                            <input type="number" step="0.01" value={afnRate} onChange={(e) => setAfnRate(parseFloat(e.target.value) || "")} className="input-luxury w-full" />
                        </div>
                        <div className="flex justify-center gap-3 pt-2">
                            <button type="button" onClick={() => setIsCurrencyToggleOn(false)} className="btn-luxury btn-luxury-outline w-28 py-2">کنسل</button>
                            <button type="button" onClick={handleSave} className="btn-luxury btn-luxury-primary w-28 py-2">ذخیره دخل</button>
                        </div>
                        {loading && <p className="text-center text-gold-600 text-sm">در حال ذخیره...</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StorageRate
