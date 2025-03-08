import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from '@/components/ui/navbar'
import Footer from '@/components/ui/footer'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kyra Ezikeuzor",
  description: "Student, developer, and writer aspiring to study molecular biology, computer science, cognitive science, and creative writing, aiming for a career in AI medicine research, global health policy, and writing. ",
  openGraph: {
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Pink, red, and orange gradient art",
      },
    ],
}
};

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
        <main className='flex-1 container mx-auto max-w-[680px] p-5'>
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
