import { createRoot } from 'react-dom/client'

import App from './components/App'
import ErrorBoundary from './components/ErrorBoundary'

import store from './store'
import { Provider } from 'react-redux'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import languageDetector from 'i18next-browser-languagedetector'

import translationEN from './locales/en/translation.json'
import translationRU from './locales/ru/translation.json'

import './style/main.scss'

const resources = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRU,
  },
}

i18n.use(languageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: 'ru',
})

const root = createRoot(document.querySelector('#app') as HTMLElement)
root.render(
  <ErrorBoundary fallback={<p>Ошибка 500. Обновите страницу</p>}>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>
)
