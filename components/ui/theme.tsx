'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeButton = () => {
  const [showDarkMode, setShowDarkMode] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', showDarkMode);
  }, [showDarkMode]);

  useEffect(() => {
    const data = window.localStorage.getItem('SEDGE_APP_THEME');
    if (data != null) setShowDarkMode(JSON.parse(data));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      'SEDGE_APP_THEME',
      JSON.stringify(showDarkMode)
    );
  }, [showDarkMode]);

  const changeTheme = () => {
    setShowDarkMode((prevMode) => !prevMode);
  };

  return (
    <div onClick={changeTheme} className="cursor-pointer">
      {showDarkMode == true ? (
        <Sun className="text-neutral-500" />
      ) : (
        <Moon className="text-neutral-500" />
      )}
    </div>
  );
};

export default ThemeButton;
