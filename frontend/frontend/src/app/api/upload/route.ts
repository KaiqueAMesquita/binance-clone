// src/app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'    // garante que não seja cache estático

export async function POST(request: Request) {
  console.log('[upload] POST /api/upload recebido')
  
  const formData = await request.formData()
  console.log('[upload] formData keys:', Array.from(formData.keys()))

  const file = formData.get('photo') as Blob | null
  if (!file) {
    console.error('[upload] nenhum arquivo “photo” em formData')
    return NextResponse.json({ error: 'Nenhum arquivo recebido' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadDir, { recursive: true })

  const filename = `${Date.now()}-${(file as any).name}`
  const filePath = path.join(uploadDir, filename)
  await fs.writeFile(filePath, buffer)
  console.log('[upload] escrito em:', filePath)

  return NextResponse.json({ url: `/uploads/${filename}` })
}
