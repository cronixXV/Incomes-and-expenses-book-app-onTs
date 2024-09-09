import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { ThemeContext } from '../helpers/ThemeContext'

export default function InfoItem(properties) {
  // eslint-disable-next-line no-unused-vars
  const [theme, setTheme, changeTheme, changeThemeNext] =
    useContext(ThemeContext)
  return (
    <>
      <div className="header">
        {properties.title}{' '}
        <span onClick={() => changeThemeNext()}>({theme})</span>
      </div>
      <div className={'user-info ' + properties.classTitle}>
        {properties.value}
      </div>
    </>
  )
}

InfoItem.defaultProps = {
  title: 'Имя пользователя',
  classTitle: 'user-name',
  value: '',
}

InfoItem.propTypes = {
  title: PropTypes.string,
  classTitle: PropTypes.string,
  value: PropTypes.string,
}
