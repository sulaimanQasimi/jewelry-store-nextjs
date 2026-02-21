import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const customer_id = body.customer_id ?? body.customerId
    const customer_name = body.customer_name ?? body.customerName ?? ''
    const customer_phone = body.customer_phone ?? body.customerPhone ?? ''
    const product_description = body.product_description ?? body.productDescription ?? ''
    const incoming_notes = body.incoming_notes ?? body.incomingNotes ?? ''
    const estimated_cost = body.estimated_cost ?? body.estimatedCost != null ? parseFloat(body.estimated_cost ?? body.estimatedCost) : null
    const currency = body.currency ?? 'AFN'
    const status = body.status ?? 'received'
    const due_date = body.due_date ?? body.dueDate ?? null

    if (!customer_id || !customer_name?.trim() || !customer_phone?.trim()) {
      return NextResponse.json({ success: false, message: 'مشتری و تلفن الزامی است' }, { status: 400 })
    }

    const validStatuses = ['received', 'in_progress', 'ready', 'delivered', 'cancelled']
    const st = validStatuses.includes(status) ? status : 'received'

    await query(
      `INSERT INTO repairs (customer_id, customer_name, customer_phone, product_description, incoming_notes, estimated_cost, currency, status, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(customer_id),
        customer_name.trim(),
        customer_phone.trim(),
        product_description.trim() || null,
        incoming_notes.trim() || null,
        estimated_cost,
        currency,
        st,
        due_date && due_date.trim() ? due_date.trim() : null
      ]
    )

    const rows = (await query('SELECT * FROM repairs ORDER BY id DESC LIMIT 1', [])) as any[]
    return NextResponse.json({
      success: true,
      message: 'تعمیر ثبت شد',
      data: rows[0]
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
