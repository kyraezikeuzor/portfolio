'use client';
import React from 'react';
import Link from 'next/link';
import { Signature } from '@/components/ui/signature';
import { Separator } from '@/components/ui/separator';

function Footer() {
  return (
    <div className="flex flex-col items-center py-5">
      <div className="max-w-[680px] w-full flex flex-col items-start justify-between px-5 py-2 gap-5">
        <br/>
        <Signature/>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          DFTBA: Don&apos;t forget to be awesome! <br/>
          I&apos;m always happy to chat! You can find me by emailing me at kyra (at) hackclub.com or kyra (at) omelora.org or any way you can find (linked above or otherwise).
        </p>
        <span className="text-neutral-500 dark:text-neutral-400 text-sm">Made with ❤️ in Texas.</span>
      </div>
    </div>
  );
}

export default Footer;
