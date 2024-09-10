type ThemeContextValue = [
  AppThemes,
  (value: SetStateAction<AppThemes>) => void,
  (theme: AppThemes) => void,
  () => void,
]
