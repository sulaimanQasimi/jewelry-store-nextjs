import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '@/lib/context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const SearchCustomer = ({fetchData , query , setQuery , handleKeyDown }) => {

    const { backendUrl } = useContext(AppContext)

    return (
        <div className="w-full flex flex-col max-w-md mx-auto relative z-0">
            <div className="flex gap-2">
                <input
                    type="text"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="جستجوی مشتری با نام"
                    className="input-luxury flex-1 py-2.5"
                    onKeyDown={handleKeyDown}
                    value={query}
                />
                <button
                    type="button"
                    onClick={fetchData}
                    className="btn-luxury btn-luxury-primary p-2.5 rounded-[10px] flex items-center justify-center transition-all duration-300 hover:scale-105"
                    aria-label="جستجو"
                >
                    <img src="/assets/search.png" className="w-5 h-5 invert" alt="" />
                </button>
            </div>
        </div>
    )
}

export default SearchCustomer
