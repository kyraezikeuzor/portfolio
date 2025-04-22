import React from 'react';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex flex-row items-center w-32">
      <img className="" src="/signature-short.svg" alt='The name Kyra written in cursive'/>
    </Link>
  );
};

export default Logo;
