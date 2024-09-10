import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserName } from '../reducers/authSlice'
import { useTranslation } from 'react-i18next'
import { RootState } from 'src/store'

enum Language {
  English = 'en',
  Russian = 'ru',
}

export default function Settings() {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [newName, setNewName] = useState('')

  const handleClick = (lang: Language) => {
    i18n.changeLanguage(lang)
  }

  const handleNameChange = () => {
    if (isAuthenticated) {
      dispatch(updateUserName(newName))
    }
  }

  return (
    <div>
      <h1 className="mb-5">{t('settingsLang.title')}</h1>
      <Button
        onClick={() => handleClick(Language.English)}
        className="custom-btn-main"
      >
        {t('settingsLang.language.english')}
      </Button>{' '}
      <Button
        onClick={() => handleClick(Language.Russian)}
        className="custom-btn-main"
      >
        {t('settingsLang.language.russian')}
      </Button>
      {isAuthenticated && (
        <div className="mt-4">
          <Form.Group>
            <Form.Label>{t('settingsLang.changeUsername')}</Form.Label>
            <Form.Control
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t('settingsLang.enterNewUsername')}
            />
          </Form.Group>
          <Button
            onClick={handleNameChange}
            variant="primary"
            className="mt-3 custom-btn-main"
          >
            {t('settingsLang.save')}
          </Button>
        </div>
      )}
    </div>
  )
}
