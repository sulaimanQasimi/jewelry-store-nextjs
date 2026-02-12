import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import CurrencyExchange from './CurrencyExchange'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import StorageRate from './StorageRate'

const Navbar = () => {

    const { token, setToken, backendUrl, companyData, setCompanyData } = useContext(AppContext)

    const handleBackup = async (req, res) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/backup/backup')
            if (data.success) {
                toast.success(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const logout = () => {
        setToken('')
        localStorage.removeItem('token')
    }
    const navigate = useNavigate()
    return (
        <div className='px-12 py-1 bg-teal-900 backdrop-blur-lg flex justify-between items-center'>
            <div className='group relative'>
                <img onClick={() => navigate(`/company-information`)} src={`http://localhost:3000/${companyData.image}`} alt="" className='w-12 object-cover rounded-full cursor-pointer' />
                <div className='absolute bg-gray-100 w-36 text-center top-16 p-4 right-12 rounded font-medium text-base text-gray-600 z-20 hidden group-hover:block'>
                </div>
            </div>
            <div>
                <div className='flex justify-center gap-4 cursor-pointer relative'>
                    <StorageRate/>
                    <img onClick={handleBackup} className='w-10 rounded-full transation-all duration-300 hover:scale-110 ' src={assets.backup_icon} alt="" />
                    <CurrencyExchange />
                </div>
            </div>
            <div className='relative group'>
                <img src={assets.logout_icon} className='w-12 cursor-pointer ' onClick={logout} alt="logout" />
                <div className='absolute left-0 top-12 w-20 hidden group-hover:block text-white bg-black p-2 text-xs rounded'>
                    <p>خارج شدن از سیستم</p>
                </div>
            </div>

        </div>
    )
}

export default Navbar
