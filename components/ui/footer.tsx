import React from 'react';
import { Signature } from '@/components/ui/signature';
import { Postscript } from './portfolio';
import { Portfolio } from '@/lib/notion'


export default async function Footer() {
  const portfolio = await new Portfolio().getPortfolio();

  return (
    <div className="flex flex-col items-center py-5">
      <div className="max-w-[680px] w-full flex flex-col items-start justify-between px-5 py-2 gap-5">
        <Signature/>
        <Postscript postscript={portfolio.postscript} />
        <span className="self-start text-neutral-500 dark:text-neutral-400 text-xs">© Made in Texas.</span>
      </div>
    </div>
  );
}

