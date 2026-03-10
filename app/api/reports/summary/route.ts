import { NextRequest, NextResponse } from 'next/server'
import { getReportsSummary } from '@/lib/reports/summary/service'
import { parseFiltersFromSearchParams } from '@/lib/reports/summary/helpers'

export async function GET(request: NextRequest) {
  try {
    const filters = parseFiltersFromSearchParams(request.nextUrl.searchParams)
    const data = await getReportsSummary(filters)
    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error('[api/reports/summary]', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to generate reports summary' },
      { status: 500 }
    )
  }
}

