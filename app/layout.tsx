// lib/metadata.ts - Create a separate file for metadata logic
import { Portfolio } from '@/lib/portfolio';
import {
  defaultThumbnailUrl,
  defaultThumbnailAlt,
  defaultSummary,
  defaultTitle,
  siteUrl,
} from '@/lib/constants';

let cachedMetadata: any = null;

export async function getMetadata() {
  if (cachedMetadata) {
    return cachedMetadata;
  }

  try {
    const portfolio = await new Portfolio().getPortfolio();
    const summary = portfolio.summary.desc;
    const thumbnail = portfolio.thumbnail;

    cachedMetadata = {
      summary: summary || defaultSummary,
      thumbnail: {
        url: thumbnail.files[0].url || defaultThumbnailUrl,
        alt: thumbnail.desc || defaultThumbnailAlt,
      },
    };

    return cachedMetadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    cachedMetadata = {
      summary: defaultSummary,
      thumbnailUrl: defaultThumbnailUrl,
    };
    return cachedMetadata;
  }
}

// layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const { summary, thumbnail } = await getMetadata();

  return {
    title: defaultTitle,
    description: summary,
    metadataBase: new URL(siteUrl),
    openGraph: {
      url: siteUrl,
      type: 'website',
      title: summary,
      description: summary,
      images: [
        {
          url: thumbnail.url,
          width: 1200,
          height: 630,
          alt: thumbnail.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: summary,
      images: [thumbnail.url],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="./favicon.ico" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="flex-1 container mx-auto max-w-[680px] p-5">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
