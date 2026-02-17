'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import FilterBar from '@/components/ui/FilterBar'
import DataTable from '@/components/ui/DataTable'
import type { ColumnDef } from '@/components/ui/DataTable'
import UserFormModal from '@/components/user/UserFormModal'
import type { UserFormData } from '@/components/user/UserFormModal'
import { toast } from 'react-toastify'

interface UserRow {
  id: number
  username: string
  email: string
  role: string
  is_active: number | boolean
  created_at: string
  updated_at: string
}

export default function UsersPage() {
  const [data, setData] = useState<UserRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<UserRow | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: res } = await axios.get<{
        success?: boolean
        data?: UserRow[]
        total?: number
      }>('/api/users/list', {
        params: { page, limit, search: search || undefined }
      })
      const list = Array.isArray(res?.data) ? res.data : []
      setData(list)
      setTotal(Number(res?.total) >= 0 ? Number(res.total) : list.length)
    } catch (err: unknown) {
      console.error('Failed to load users:', err)
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      if ((err as { response?: { status?: number } })?.response?.status === 403) {
        toast.error('دسترسی غیرمجاز')
      }
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (row: UserRow) => {
    setEditing(row)
    setModalOpen(true)
  }

  const handleDelete = async (row: UserRow) => {
    if (!confirm(`آیا از غیرفعال کردن کاربر «${row.username}» اطمینان دارید؟`)) return
    try {
      const { data: res } = await axios.delete(`/api/users/delete/${row.id}`)
      if (res?.success) {
        toast.success(res.message ?? 'کاربر غیرفعال شد')
        fetchData()
      } else {
        toast.error(res?.message ?? 'خطا')
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      toast.error(msg ?? (err instanceof Error ? err.message : 'خطا'))
    }
  }

  const formatDate = (s: string) => {
    if (!s) return '-'
    try {
      const d = new Date(s)
      return Number.isNaN(d.getTime()) ? s : d.toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    } catch {
      return s
    }
  }

  const columns: ColumnDef<UserRow>[] = [
    { key: 'id', label: '#' },
    { key: 'username', label: 'نام کاربری' },
    { key: 'email', label: 'ایمیل', className: 'font-mono text-sm' },
    {
      key: 'role',
      label: 'نقش',
      render: (r) => (r.role === 'admin' ? 'مدیر' : 'کاربر')
    },
    {
      key: 'is_active',
      label: 'وضعیت',
      render: (r) => (r.is_active ? 'فعال' : 'غیرفعال')
    },
    {
      key: 'created_at',
      label: 'تاریخ ایجاد',
      render: (r) => formatDate(r.created_at)
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openEdit(r)}
            className="btn-luxury btn-luxury-outline py-1.5 px-3 text-sm"
          >
            ویرایش
          </button>
          <button
            type="button"
            onClick={() => handleDelete(r)}
            className="btn-luxury py-1.5 px-3 text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800"
          >
            غیرفعال
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">مدیریت کاربران</h1>
          <p className="mt-1 text-sm text-charcoal-soft">لیست کاربران را با فیلتر و صفحه‌بندی مشاهده کنید.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-luxury btn-luxury-primary px-6 py-2 shrink-0"
        >
          افزودن کاربر
        </button>
      </header>

      <section>
        <h2 className="font-heading text-lg font-semibold text-charcoal mb-4">لیست کاربران</h2>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="نام کاربری یا ایمیل..."
          onReset={() => setSearch('')}
        />
        <div className="mt-4">
          <DataTable<UserRow>
            columns={columns}
            data={data}
            keyField="id"
            loading={loading}
            emptyMessage="کاربر یافت نشد"
            pagination={{
              page,
              limit,
              total,
              onPageChange: setPage,
              onLimitChange: setLimit
            }}
            minWidth="900px"
          />
        </div>
      </section>

      <UserFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        mode={editing ? 'edit' : 'create'}
        initialData={
          editing
            ? {
                id: editing.id,
                username: editing.username,
                email: editing.email,
                role: editing.role === 'user' ? 'user' : 'admin',
                is_active: !!editing.is_active
              }
            : null
        }
        onSuccess={fetchData}
      />
    </div>
  )
}
