import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { spentId: string } }
) {
  try {
    const { spentId } = params

    await prisma.expenses.delete({
      where: { id: parseInt(spentId) }
    })

    return NextResponse.json({ success: true, message: 'دیتا حذف شد' })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
