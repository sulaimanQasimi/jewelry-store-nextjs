'use client'

import axios from 'axios'
import { createContext, useEffect, useState, ReactNode } from 'react'
import { toast } from 'react-toastify'

export const AppContext = createContext<any>(null)

if (typeof window !== 'undefined') {
  axios.defaults.withCredentials = true
}

interface AppContextProviderProps {
  children: ReactNode
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [companyData, setCompanyData] = useState<any[]>([])
  const [existProduct, setExistProduct] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [spents, setSpents] = useState<any[]>([])
  const [loanData, setLoanData] = useState<any[]>([])
  const [rate, setRate] = useState('')
  const [saved, setSaved] = useState(false)
  const [usdRate, setUsdRate] = useState('')
  const [afnRate, setAfnRate] = useState('')
  const [AllSales, setAllSales] = useState<any[]>([])

  const [companyInformation, setCompanyInformation] = useState({
    CompanyName: 'دستگاه زرگری نصیر احمد',
    slogan: 'باما بدرخشید',
    phone: '0788121212',
    email: 'nasir@gmail.com',
    address: 'مزارشریف',
    logo: 'img'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRate = localStorage.getItem('dollerRate')
      if (storedRate) {
        setRate(storedRate)
      }
    }
  }, [])

  const saveRate = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dollerRate', rate)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRate = localStorage.getItem('usdRate')
      if (storedRate) {
        setUsdRate(storedRate)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRate = localStorage.getItem('afnRate')
      if (storedRate) {
        setAfnRate(storedRate)
      }
    }
  }, [])

  const saveStorageRate = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('usdRate', usdRate)
      localStorage.setItem('afnRate', afnRate)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const getCompanyData = async () => {
    try {
      const response = await axios.get('/api/company/company-data')

      if (response.data.success) {
        setCompanyData(response.data.companyData)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const getExistProduct = async () => {
    try {
      const { data } = await axios.get('/api/product/exist-product')

      if (data) {
        setExistProduct(data.products)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const getCustomers = async () => {
    try {
      const { data } = await axios.get('/api/customer/registered-customers')

      if (data && Array.isArray(data.customers)) {
        setCustomers(data.customers)
      } else if (data && Array.isArray(data.data)) {
        setCustomers(data.data)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const getSpents = async () => {
    try {
      const { data } = await axios.get('/api/expense/get-spent')

      if (data.success) {
        setSpents(data.spent)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const getLoan = async () => {
    try {
      const { data } = await axios.get('/api/transaction/loan-transaction')

      if (!data.success) {
        toast.error('قرضدار وجود ندارد')
      }

      if (data.success) {
        console.log(data)
        setLoanData(data.loans)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const getAllSaleReport = async () => {
    try {
      const { data } = await axios.get('/api/transaction/sale-report')
      if (!data.success) {
        toast.error(data.message)
      }
      if (data.success) {
        setAllSales(data)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const value = {
    companyInformation,
    setCompanyInformation,
    companyData,
    setCompanyData,
    getCompanyData,
    getExistProduct,
    existProduct,
    setExistProduct,
    customers,
    setCustomers,
    getCustomers,
    spents,
    setSpents,
    getSpents,
    backendUrl: '',
    getLoan,
    setLoanData,
    loanData,
    rate,
    setRate,
    saved,
    setSaved,
    saveRate,
    getAllSaleReport,
    AllSales,
    usdRate,
    setUsdRate,
    afnRate,
    setAfnRate,
    saveStorageRate
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContextProvider
