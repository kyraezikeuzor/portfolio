'use client';
import React, { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type NavigateProps = {
  targetId: string;
  navigateId: string;
  parentPage: string;
  children: React.ReactNode;
};

export function Navigate({ targetId, navigateId, parentPage, children }: NavigateProps) {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = useCallback((section: HTMLElement) => {
    const navbar = document.querySelector('nav');
    if (!navbar) return;

    const navbarHeight = navbar.offsetHeight;
    const targetPosition = section.offsetTop - navbarHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'instant',
    });
  }, []);

  useEffect(() => {
    const navigateButton = document.getElementById(navigateId);

    const scrollToTarget = (e: Event) => {
      e.preventDefault();

      // If we're not on the correct page, navigate there first
      if (pathname !== parentPage) {
        // Navigate immediately with the hash
        router.push(`${parentPage}#${targetId}`);
        
        // Try to scroll after a very short delay to allow for page load
        const checkAndScroll = () => {
          const section = document.getElementById(targetId);
          if (section) {
            scrollToSection(section);
          }
        };
        
        // Try multiple times with increasing delays
        setTimeout(checkAndScroll, 10);
        setTimeout(checkAndScroll, 50);
        setTimeout(checkAndScroll, 100);
      } else {
        // If we're already on the correct page, just scroll
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          history.pushState(null, '', `${parentPage}#${targetId}`);
          scrollToSection(targetSection);
        }
      }
    };

    // Handle scroll when hash matches and element exists
    if (window.location.hash === `#${targetId}`) {
      const section = document.getElementById(targetId);
      if (section) {
        scrollToSection(section);
      }
    }

    if (navigateButton) {
      navigateButton.addEventListener('click', scrollToTarget);
    }

    return () => {
      if (navigateButton) {
        navigateButton.removeEventListener('click', scrollToTarget);
      }
    };
  }, [targetId, navigateId, parentPage, pathname, router, scrollToSection]);

  return (
    <div id={navigateId} className="cursor-pointer">
      {children}
    </div>
  );
}