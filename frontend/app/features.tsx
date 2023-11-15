import React, { useEffect, useState } from 'react';

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return windowWidth;
};

export const MarginNavBarHandle = (windowWidth: number) => {
  const marginLeftValue = windowWidth >= 1024 ? 'ml-[288px]' : '0';
  return marginLeftValue;
};
