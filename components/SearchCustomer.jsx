import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '@/lib/context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Search } from 'lucide-react'

const SearchCustomer = ({ fetchData, query, setQuery, handleKeyDown }) => {

    const { backendUrl } = useContext(AppContext)

    return (
        <div className="w-full flex flex-col max-w-md mx-auto relative z-0">
            <div className="flex gap-2 relative">
                <input
                    type="text"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="جستجوی مشتری با نام"
                    className="input-luxury flex-1 pl-12"
                    onKeyDown={handleKeyDown}
                    value={query}
                />
                <button
                    type="button"
                    onClick={fetchData}
                    className="absolute left-1 top-1 bottom-1 p-2 rounded-lg bg-gold-500 text-white hover:bg-gold-600 transition-all duration-300 flex items-center justify-center"
                    aria-label="جستجو"
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default SearchCustomer
