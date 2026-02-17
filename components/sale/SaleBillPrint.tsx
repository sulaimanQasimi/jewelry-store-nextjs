'use client'

import React from 'react'
import SaleInvoice from './SaleInvoice'
import type { TransactionForPrint } from './SaleInvoice'

export type { TransactionForPrint }

/** Legacy print-only bill: now renders the elegant SaleInvoice for print. */
export default function SaleBillPrint({ data }: { data: TransactionForPrint }) {
  return <SaleInvoice data={data} forPrint />
}
