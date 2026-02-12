import React, { useContext, useState,useEffect } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const SearchCustomer = ({fetchData , query , setQuery , handleKeyDown }) => {

    const { backendUrl } = useContext(AppContext)

    return (
        <div className="w-full flex flex-col max-w-md mx-auto relative z-0">
            <div className='flex gap-1 py-2 px-2'>
                <input
                    type="text"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="جستجوی مشتری با نام"
                    className="w-full border py-1 rounded-xs border-gray-500 focus:outline-none focus:ring px-2"
                    onKeyDown={handleKeyDown}
                    value={query}
                />
                <img onClick={fetchData} src={assets.search_icon} className='w-7' alt="" />
            </div>
            
        </div>
    )
}

export default SearchCustomer
