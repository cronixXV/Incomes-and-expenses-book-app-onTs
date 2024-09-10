import React from 'react'

export enum AppThemes {
  Light = 'light',
  Dark = 'dark',
}

export const ThemeContext = React.createContext<ThemeContextValue | null>(null)
