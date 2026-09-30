import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { getResumeDocument } from '@/lib/resume';
import { ResumePdf } from '@/app/resume/resume-pdf';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const revalidate = 60;

export async function GET() {
  const resume = await getResumeDocument();
  const document = React.createElement(ResumePdf, {
    resume,
  }) as unknown as Parameters<typeof renderToBuffer>[0];
  const pdf = await renderToBuffer(document);

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Kyra-Ezikeuzor-Resume.pdf"',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
