'use client'

import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '@/lib/context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const { token, setToken } = useContext(AppContext)
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const { data } = await axios.post('/api/admin/login', { password, email })
      if (data.success) {
        console.log(data)
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token)
        }
        setToken(data.token)
        router.push('/company-information')
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      router.push('/company-information')
    }
  }, [token, router])

  return (
    <div className="h-screen w-full bg-teal-100/70 flex justify-center items-center">
      <div className="h-[70vh] shadow-teal-900 shadow-2xl rounded-xl relative w-3xl border-8 border-cyan-200/50">
        <Image
          src="/assets/jwelryImg.jpg"
          alt=""
          fill
          className="object-cover rounded-xl"
        />

        <form
          onSubmit={onSubmitHandler}
          className="flex bg-white items-center w-72 h-[90%] absolute top-5 right-4 z-10 rounded-xl"
        >
          <div className="flex flex-col gap-6 mt-8 items-end px-8 py-4 rounded-r-xl text-zinc-600 text-sm relative">
            <Image
              src="/assets/gemify.png"
              alt=""
              width={96}
              height={96}
              className="absolute -top-28 right-23"
            />

            <div className="w-full">
              <p>نام کاربری</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div className="w-full">
              <p>رمز</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>
            <button className="bg-teal-800 text-white w-full py-2 rounded-md text-base">
              ورود
            </button>
            <div className="w-full text-gray-500">
              <p>
                <span>©</span>{' '}
                <span>تمام حقوق متعلق به شرکت گلگسی تکنالوچی میباشد </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
