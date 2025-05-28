import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import uploadNotionImagesToCloudinary  from '@/lib/uploader'
import NotionClient from '@/lib/notion'
import Logger from '@/lib/logger'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  try {
    // Revalidate the entire site
    revalidatePath('/')

    const notionClient = new NotionClient(process.env.NEXT_PUBLIC_NOTION_TOKEN || '', new Logger('debug'))
    const pageIds = await notionClient.getPageIdsFromDatabase(process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || '')

    for (const pageId of pageIds) {
      await uploadNotionImagesToCloudinary({
        notionToken: process.env.NEXT_PUBLIC_NOTION_TOKEN || '',
        notionPageId: pageId,
        cloudinaryUrl: process.env.NEXT_PUBLIC_CLOUDINARY_URL || '',
        cloudinaryUploadFolder: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER || '',
        logLevel: process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? 'debug' : 'error',
        uploadExternalsNotOnCloudinary: process.env.NEXT_PUBLIC_UPLOAD_EXTERNALS_NOT_ON_CLOUDINARY
          ? process.env.NEXT_PUBLIC_UPLOAD_EXTERNALS_NOT_ON_CLOUDINARY === '1'
          : false,
      })
    }

    return NextResponse.json({ 
      revalidated: true, 
      message: 'Site revalidated',
      timestamp: Date.now() 
    })


  } catch (err) {
    return NextResponse.json({ 
      message: 'Error revalidating', 
      error: err instanceof Error ? err.message : 'Unknown error' 
    }, { status: 500 })
  }
}

