export const CATEGORY_OPTIONS = [
  { value: 'food', label: 'Еда' },
  { value: 'electronics', label: 'Электроника' },
  { value: 'fun', label: 'Развлечения' },
  { value: 'other', label: 'Другое' },
]

export function getCategoryLabel(category: string) {
  const item = CATEGORY_OPTIONS.find(
    (item) => item.value === category.toString()
  )

  return item ? item.label : null
}

export const TYPE_OPTIONS = [
  { value: '0', label: 'Доходы' },
  { value: '1', label: 'Расходы' },
]

export function getTypeLabel(type: number) {
  const item = TYPE_OPTIONS.find((item) => item.value === type.toString())

  return item ? item.label : null
}
