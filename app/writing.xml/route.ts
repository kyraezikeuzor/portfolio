import { NextResponse } from 'next/server';
import { Portfolio } from '@/lib/portfolio';
import { ParsedRichText } from '@/types';
import { siteUrl } from '@/lib/constants';

export const revalidate = 60;

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function richTextToPlain(desc: ParsedRichText[]) {
  return desc.map((line) => line.text).join('');
}

export async function GET() {
  const portfolio = await new Portfolio().getPortfolio();

  const items = portfolio.writing
    .map((item) => {
      const description = richTextToPlain(item.desc);

      return `  <item>
    <id>${escapeXml(item.id)}</id>
    <title>${escapeXml(item.name)}</title>
    <description>${escapeXml(description)}</description>
    <link>${escapeXml(item.link)}</link>
    <group>${escapeXml(item.group)}</group>
    <datePublished>${escapeXml(item.datePublished)}</datePublished>
  </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<writing xmlns="${siteUrl}/writing.xml" updated="${new Date().toISOString()}">
${items}
</writing>
`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=60, stale-while-revalidate',
    },
  });
}
