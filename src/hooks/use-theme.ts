import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';
export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const setColorScheme = useThemeStore((state) => state.setColorScheme);
  useEffect(() => {
    const root = window.document.documentElement;
    // Handle color scheme
    root.classList.remove('theme-iium');
    if (colorScheme === 'iium') {
      root.classList.add('theme-iium');
    }
    // Handle theme (light/dark/system)
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        root.classList.toggle('dark', e.matches);
      }
    };
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (theme === 'system') {
      root.classList.toggle('dark', mediaQuery.matches);
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      root.classList.toggle('dark', theme === 'dark');
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme, colorScheme]);
  return { theme, colorScheme, setTheme, setColorScheme };
}