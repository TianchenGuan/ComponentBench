'use client';

import React from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeProvider, createTheme } from '@mui/material';
import { MantineProvider } from '@mantine/core';
import type { TaskSpec, Library } from '@/types';

interface ThemeWrapperProps {
  task: TaskSpec;
  children: React.ReactNode;
}

/**
 * Get theme colors based on scene_context.theme
 */
export function getThemeColors(theme: string) {
  const isDark = theme === 'dark';
  const isHighContrast = theme === 'high_contrast';
  
  return {
    isDark,
    isHighContrast,
    bgColor: isDark ? '#141414' : isHighContrast ? '#000' : '#f5f5f5',
    textColor: isDark ? '#fff' : isHighContrast ? '#fff' : '#333',
    headerBg: isDark ? '#1f1f1f' : isHighContrast ? '#111' : '#fff',
    headerBorder: isDark ? '#303030' : isHighContrast ? '#333' : '#e8e8e8',
  };
}

/**
 * ThemeWrapper applies the theme from scene_context to component.
 * Note: This does NOT include the viewport background - that should be
 * applied at the page level using getThemeColors().
 */
export function ThemeWrapper({ task, children }: ThemeWrapperProps) {
  const { theme } = task.scene_context;
  const { isDark } = getThemeColors(theme);

  // Wrap with appropriate provider based on library (no global styles)
  return wrapWithLibraryProvider(task.implementation_source, isDark, children);
}

/**
 * Wrap children with the appropriate UI library's theme provider.
 * NOTE: We intentionally do NOT use MUI CssBaseline as it applies global styles
 * that persist across navigation.
 */
function wrapWithLibraryProvider(library: Library, isDark: boolean, children: React.ReactNode): React.ReactNode {
  switch (library) {
    case 'antd':
      return (
        <ConfigProvider
          theme={{
            algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          }}
        >
          {children}
        </ConfigProvider>
      );
    
    case 'mui':
      const muiTheme = createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
        },
      });
      // Note: No CssBaseline - it applies global styles that leak to other pages
      return (
        <ThemeProvider theme={muiTheme}>
          {children}
        </ThemeProvider>
      );
    
    case 'mantine':
      return (
        <MantineProvider forceColorScheme={isDark ? 'dark' : 'light'}>
          {children}
        </MantineProvider>
      );
    
    default:
      return children;
  }
}

export default ThemeWrapper;
