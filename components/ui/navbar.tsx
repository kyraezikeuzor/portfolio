import React from 'react';
import Theme from './theme';
import { Separator } from '@/components/ui/separator';
import { Navigate } from '@/components/ui/navigate';

export default function Navbar() {
  return (
    <nav className="z-50 sticky top-0 bg-[--clr-base] flex flex-col justify-center items-center py-5">
      <div className="w-full max-w-[680px] px-5 flex flex-row justify-end">
        <div className="flex flex-row gap-2 items-center">
          <div className="flex flex-row gap-2 h-5 items-center px-3 text-sm text-neutral-700 dark:text-neutral-200">
            <Navigate targetId="work" navigateId="navigateWork" parentPage="/">
              Work
            </Navigate>
            <Separator orientation="vertical" className='h-3'/>
            <Navigate targetId="projects" navigateId="navigateProjects" parentPage="/">
              Projects
            </Navigate>
            <Separator orientation="vertical" className='h-3' />
            <Navigate targetId="writing" navigateId="navigateWriting" parentPage="/">
              Writing
            </Navigate>
            <Separator orientation="vertical" className='h-3' />
            <Navigate targetId="press" navigateId="navigatePress" parentPage="/">
              Press
            </Navigate>
          </div>
          <br/>
          <Theme/>
        </div>
      </div>
    </nav>
  );
}