import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

import uploadNotionImagesToCloudinary from '@/lib/uploader';
import NotionClient from '@/lib/notion';
import Logger from '@/lib/logger';
import { requireEnv } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    // Revalidate every route, not just the home page — /projects,
    // /projects/[slug], /resume.pdf and /writing.xml cache independently
    revalidateTag('portfolio');
    revalidatePath('/', 'layout');

    const notionToken = requireEnv('NOTION_TOKEN');
    const notionClient = new NotionClient(notionToken, new Logger('error'));
    const pageIds = await notionClient.getPageIdsFromDatabase(
      requireEnv('NOTION_DB_ID')
    );

    for (const pageId of pageIds) {
      await uploadNotionImagesToCloudinary({
        notionToken,
        notionPageId: pageId,
        cloudinaryUrl: requireEnv('CLOUDINARY_URL'),
        cloudinaryUploadFolder: process.env.CLOUDINARY_UPLOAD_FOLDER || '',
        logLevel: process.env.SYNC_LOG_LEVEL === 'debug' ? 'debug' : 'error',
        uploadExternalsNotOnCloudinary:
          process.env.UPLOAD_EXTERNALS_NOT_ON_CLOUDINARY === '1',
      });
    }

    return NextResponse.json({
      revalidated: true,
      message: 'Site revalidated',
      timestamp: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: 'Error revalidating',
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
