'use client';
import React from 'react';
import Link from 'next/link';
import Theme from './theme';
import Logo from './logo';
import { Separator } from '@/components/ui/separator';
import { Navigate } from '@/components/ui/navigate';

export default function Navbar() {
  return (
    <nav className="z-50 sticky top-0 bg-[--clr-base] flex flex-col justify-center items-center py-5">
      <div className="w-full max-w-[680px] px-5 flex flex-row justify-end">
        <div className="flex flex-row gap-2 items-center">
          <div className="flex flex-row gap-2 h-5 items-center px-3 text-neutral-500 dark:text-neutral-400">
            <Navigate targetId="work" navigateId="navigateWork">
              Work
            </Navigate>
            <Separator orientation="vertical" />
            <Navigate targetId="projects" navigateId="navigateProjects">
              Projects
            </Navigate>
            <Separator orientation="vertical" />
            <Navigate targetId="writing" navigateId="navigateWriting">
              Writing
            </Navigate>
            <Separator orientation="vertical" />
            <Navigate targetId="press" navigateId="navigatePress">
              Press
            </Navigate>
          </div>
          <br />
          <Theme />
        </div>
      </div>
    </nav>
  );
}
