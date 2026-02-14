'use client'

import React, { createContext, useContext, useState } from 'react'

const SupplierProductContext = createContext(null)

export function SupplierProductProvider({ children }) {
  const [supplierCart, setSupplierCart] = useState([])
  return (
    <SupplierProductContext.Provider value={{ supplierCart, setSupplierCart }}>
      {children}
    </SupplierProductContext.Provider>
  )
}

export function useSupplierCart() {
  const ctx = useContext(SupplierProductContext)
  if (!ctx) {
    throw new Error('useSupplierCart must be used within SupplierProductProvider')
  }
  return ctx
}
