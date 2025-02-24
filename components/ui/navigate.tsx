'use client';
import React, { useEffect } from 'react';

type NavigateProps = {
  targetId: string;
  navigateId: string;
  children: React.ReactNode;
};

export function Navigate({ targetId, navigateId, children }: NavigateProps) {
  useEffect(() => {
    const navigateButton = document.getElementById(navigateId);
    const targetSection = document.getElementById(targetId);

    const scrollToTarget = (e: MouseEvent) => {
      e.preventDefault();

      if (targetSection) {
        const navbar = document.querySelector('nav');
        if (!navbar) return;

        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight - 20;

        // Update URL hash without triggering scroll
        history.pushState(null, '', `#${targetId}`);

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    };

    if (navigateButton && targetSection) {
      navigateButton.addEventListener('click', scrollToTarget as EventListener);
    }

    return () => {
      if (navigateButton && targetSection) {
        navigateButton.removeEventListener(
          'click',
          scrollToTarget as EventListener
        );
      }
    };
  }, [targetId, navigateId]);

  return (
    <div id={navigateId} className="cursor-pointer">
      {children}
    </div>
  );
}
