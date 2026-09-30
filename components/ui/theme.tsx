'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const themeStorageKey = 'KYRA_PORTFOLIO_THEME';

export default function Theme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    const shouldUseDark =
      storedTheme === 'dark' ||
      storedTheme === 'true' ||
      (!storedTheme &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  function toggleTheme() {
    setIsDark((currentTheme) => {
      const nextTheme = !currentTheme;
      document.documentElement.classList.toggle('dark', nextTheme);
      window.localStorage.setItem(
        themeStorageKey,
        nextTheme ? 'dark' : 'light'
      );

      return nextTheme;
    });
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Use light theme' : 'Use dark theme'}
      className="fixed bottom-5 right-5 z-50 rounded-full border border-[color:var(--border-card)] bg-[color:var(--surface-card)] p-3 text-[color:var(--text-tertiary)] transition-colors duration-150 hover:bg-[color:var(--surface-secondary)] hover:text-[color:var(--text-primary)] print:hidden"
    >
      {isDark ? (
        <Sun aria-hidden="true" className="h-5 w-5" />
      ) : (
        <Moon aria-hidden="true" className="h-5 w-5" />
      )}
    </button>
  );
}
