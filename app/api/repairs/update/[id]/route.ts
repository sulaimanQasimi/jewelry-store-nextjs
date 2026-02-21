import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idNum = parseInt(id, 10)
    if (isNaN(idNum)) {
      return NextResponse.json({ success: false, message: 'شناسه نامعتبر' }, { status: 400 })
    }

    const body = await request.json()
    const customer_name = body.customer_name ?? body.customerName ?? ''
    const customer_phone = body.customer_phone ?? body.customerPhone ?? ''
    const product_description = body.product_description ?? body.productDescription ?? ''
    const incoming_notes = body.incoming_notes ?? body.incomingNotes ?? ''
    const estimated_cost = body.estimated_cost ?? body.estimatedCost != null ? parseFloat(body.estimated_cost ?? body.estimatedCost) : null
    const currency = body.currency ?? 'AFN'
    const status = body.status ?? 'received'
    const due_date = body.due_date ?? body.dueDate ?? null
    const completed_at = body.completed_at ?? body.completedAt

    const validStatuses = ['received', 'in_progress', 'ready', 'delivered', 'cancelled']
    const st = validStatuses.includes(status) ? status : 'received'

    await query(
      `UPDATE repairs SET
        customer_name = ?, customer_phone = ?, product_description = ?, incoming_notes = ?,
        estimated_cost = ?, currency = ?, status = ?, due_date = ?,
        completed_at = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        customer_name,
        customer_phone,
        product_description || null,
        incoming_notes || null,
        estimated_cost,
        currency,
        st,
        due_date && String(due_date).trim() ? String(due_date).trim() : null,
        completed_at ?? null,
        idNum
      ]
    )

    const rows = (await query('SELECT * FROM repairs WHERE id = ?', [idNum])) as any[]
    return NextResponse.json({
      success: true,
      message: 'تعمیر به‌روزرسانی شد',
      data: rows[0]
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
