import { getPortfolioData } from '@/lib/portfolio';
import {
  defaultThumbnailUrl,
  defaultThumbnailAlt,
  defaultSummary,
  defaultTitle,
  siteUrl,
} from '@/lib/constants';

type SiteMetadata = {
  summary: string;
  thumbnail: {
    url: string;
    alt: string;
  };
};

const fallbackMetadata: SiteMetadata = {
  summary: defaultSummary,
  thumbnail: {
    url: defaultThumbnailUrl,
    alt: defaultThumbnailAlt,
  },
};

async function getMetadata(): Promise<SiteMetadata> {
  try {
    const portfolio = await getPortfolioData();
    const summary = portfolio.summary.desc;
    const thumbnail = portfolio.thumbnail;

    if (!summary) {
      console.warn(
        '[metadata] No Summary entry published in Notion — using defaultSummary'
      );
    }

    if (!thumbnail.files[0]?.url) {
      console.warn(
        '[metadata] No Thumbnail image in Notion — using defaultThumbnailUrl'
      );
    }

    return {
      summary: summary || defaultSummary,
      thumbnail: {
        url: thumbnail.files[0]?.url || defaultThumbnailUrl,
        alt: thumbnail.desc || defaultThumbnailAlt,
      },
    };
  } catch (error) {
    console.error(
      '[metadata] Failed to load portfolio, serving placeholder metadata:',
      error
    );
    return fallbackMetadata;
  }
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import Theme from '@/components/ui/theme';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export async function generateMetadata(): Promise<Metadata> {
  const { summary, thumbnail } = await getMetadata();

  return {
    title: defaultTitle,
    description: summary,
    metadataBase: new URL(siteUrl),
    openGraph: {
      url: siteUrl,
      type: 'website',
      title: defaultTitle,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${inter.className}`}>
        <Navbar />
        <main className="container mx-auto max-w-[700px] flex-1 px-5 pb-8 pt-12 sm:pb-10 sm:pt-14">
          {children}
        </main>
        <Footer />
        <Theme />
      </body>
    </html>
  );
}
