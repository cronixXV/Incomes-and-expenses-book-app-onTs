/* eslint-disable no-console */
const loggingMiddleware = (store) => (next) => (action) => {
  console.group(action.type)
  console.info('Действие:', action)
  console.info('Состояние до выполнения действия:', store.getState())

  const result = next(action)
  console.info('Состояние после выполнения действия:', store.getState())
  console.groupEnd()
  return result
}

export default loggingMiddleware
