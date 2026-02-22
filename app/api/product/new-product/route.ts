import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { generateBarcode } from '@/lib/utils'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const productName = (formData.get('productName') as string) ?? ''
    const type = (formData.get('type') as string) ?? ''
    const gram = parseFloat((formData.get('gram') as string) || '0')
    const karat = parseFloat((formData.get('karat') as string) || '0')
    const bellNumber = formData.get('bellNumber') ? parseInt(formData.get('bellNumber') as string, 10) : null
    const wage = parseFloat((formData.get('wage') as string) || '0')
    const auns = parseFloat((formData.get('auns') as string) || '0')
    const pricingMode = (formData.get('pricing_mode') as string) === 'gold_based' ? 'gold_based' : 'fixed'
    const wagePerGramRaw = formData.get('wage_per_gram') as string | null
    const wagePerGram = wagePerGramRaw != null && wagePerGramRaw !== '' ? parseFloat(wagePerGramRaw) : null
    const imageFile = formData.get('image') as File | null
    const categoryIdsRaw = formData.get('categoryIds') as string | null
    let categoryIds: number[] = []
    if (categoryIdsRaw) {
      try {
        const parsed = JSON.parse(categoryIdsRaw) as unknown
        categoryIds = Array.isArray(parsed) ? parsed.filter((x): x is number => typeof x === 'number') : []
      } catch {
        categoryIds = []
      }
    }

    if (!productName.trim() || !gram || !karat) {
      return NextResponse.json({ success: false, message: 'لطفا نام جنس، وزن و عیار را وارد کنید' })
    }

    const barcode = generateBarcode()
    let imagePath: string | null = null

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadDir = join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      const filename = `${Date.now()}-${(imageFile.name || 'image').replace(/[^a-zA-Z0-9.-]/g, '_')}`
      imagePath = `/uploads/${filename}`
      await writeFile(join(uploadDir, filename), buffer)
    }

    const today = new Date().toISOString().split('T')[0]
    const rates = (await query('SELECT * FROM currency_rates WHERE date = ? LIMIT 1', [today])) as { usdToAfn?: number }[]
    const rate = rates?.[0]
    if (!rate?.usdToAfn) {
      return NextResponse.json({
        success: false,
        message: 'نرخ امروز دالر ثبت نشده'
      })
    }

    const purchasePriceToAfn = (Number(auns / 12.15 / 24) * (Number(karat) + 0.12) + Number(wage)) * Number(rate.usdToAfn) * Number(gram)

    await query(
      `INSERT INTO products (productName, type, gram, karat, purchasePriceToAfn, bellNumber, isSold, barcode, image, wage, auns, pricing_mode, wage_per_gram, isFragment)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, 0)`,
      [
        productName,
        type,
        gram,
        karat,
        purchasePriceToAfn,
        bellNumber ?? null,
        barcode,
        imagePath ?? null,
        wage || null,
        auns || null,
        pricingMode,
        wagePerGram ?? null
      ]
    )
    const inserted = (await query('SELECT * FROM products WHERE barcode = ? ORDER BY id DESC LIMIT 1', [barcode])) as Record<string, unknown>[]
    const newProduct = inserted?.[0] ?? null
    const newProductId = newProduct ? Number((newProduct as Record<string, unknown>).id) : null

    if (newProductId != null && categoryIds.length > 0) {
      for (const catId of categoryIds) {
        if (catId > 0) await query('INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)', [newProductId, catId])
      }
    }

    return NextResponse.json({
      success: true,
      message: 'دیتا موفقانه ثبت شد',
      newProduct
    })
  } catch (error: unknown) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'خطا'
    })
  }
}
