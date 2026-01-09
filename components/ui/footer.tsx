import React from 'react';
import { Signature } from '@/components/ui/signature';
import { Postscript } from './portfolio';
import { Portfolio } from '@/lib/portfolio';
import { Separator } from '@/components/ui/separator';

export default async function Footer() {
  const portfolio = await new Portfolio().getPortfolio();

  return (
    <div className="flex flex-col items-center py-5">
      <div className="max-w-[680px] w-full flex flex-col items-start justify-between px-5 py-2 gap-5">
        <Separator className="max-w-[680px]" />
        <br />
        <Signature />
        <Postscript postscript={portfolio.postscript} />
        <span className="self-start text-sm -tracking-[0.005em] text-neutral-500 dark:text-neutral-400">
          © Made in Texas
        </span>
      </div>
    </div>
  );
}
