import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from '@/components/ui/navbar'
import Footer from '@/components/ui/footer'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="./favicon.ico"/>
      </head>
      <body className={inter.className}>
        <Navbar/>
        <main className='flex-1 container mx-auto max-w-[680px] px-6'>
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
