'use client';
import React from 'react';
import Link from 'next/link';
import { Signature } from '@/components/ui/signature';
import { Separator } from '@/components/ui/separator';

function Footer() {
  return (
    <div className="flex flex-col items-center py-5">
      <div className="max-w-[680px] w-full flex flex-col items-start justify-between px-5 py-2 gap-10">
        <Separator />
        <Signature />
        <span className="text-neutral-400 text-sm">Made with ❤️ in Texas.</span>
      </div>
    </div>
  );
}

export default Footer;
