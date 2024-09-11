import { useTranslation } from 'react-i18next'

export default function Error404() {
  const { t } = useTranslation()

  return (
    <>
      <div>{t('error404.pageNotFound')}</div>
    </>
  )
}
