'use client'

import React, { useState, useCallback } from 'react'
import SupplierSearch from '@/components/supplier/SupplierSearch'
import SupplierProductForm from '@/components/supplier/SupplierProductForm'
import SupplierProductTable from '@/components/supplier/SupplierProductTable'

interface SelectedSupplier {
  id: number
  name: string
}

export default function RegisterSupplierProductPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<SelectedSupplier | null>(null)
  const [tableRefreshKey, setTableRefreshKey] = useState(0)

  const handleSupplierSelect = useCallback((supplier: { id: number; name: string }) => {
    setSelectedSupplier(supplier)
  }, [])

  const handleFormSuccess = useCallback(() => {
    setTableRefreshKey((k) => k + 1)
  }, [])

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold text-charcoal">ثبت اجناس تمویل‌کننده</h1>
        <p className="mt-1 text-sm text-charcoal-soft">تمویل‌کننده را انتخاب کنید و اجناس را ثبت کنید.</p>
      </header>

      <section className="card-luxury rounded-2xl border border-gold-200/50 p-6">
        <label className="mb-2 block text-sm font-medium text-charcoal">انتخاب تمویل‌کننده</label>
        <div className="max-w-md">
          <SupplierSearch onSelect={handleSupplierSelect} placeholder="جستجو با نام تمویل کننده" />
        </div>
        {selectedSupplier && (
          <p className="mt-2 text-sm text-gold-700">
            انتخاب شده: <span className="font-medium">{selectedSupplier.name}</span>
          </p>
        )}
      </section>

      {selectedSupplier && (
        <SupplierProductForm
          supplierId={selectedSupplier.id}
          supplierName={selectedSupplier.name}
          onSuccess={handleFormSuccess}
        />
      )}

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست اجناس ثبت‌شده</h2>
        <SupplierProductTable
          supplierId={selectedSupplier?.id ?? null}
          refreshKey={tableRefreshKey}
        />
      </section>
    </div>
  )
}
