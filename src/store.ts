import { configureStore, Middleware } from '@reduxjs/toolkit'
import rootReducer from './reducers'
import loggingMiddleware from './middleware/loggingMiddleware'
import forbiddenActionMiddleware from './middleware/forbiddenActionMiddleware'
import syncMiddleware from './middleware/syncMiddleware'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    /* eslint-disable unicorn/prefer-spread */
    return getDefaultMiddleware({
      thunk: {
        // Указываем extraArgument
        extraArgument: undefined,
      },
      serializableCheck: false, // Отключаем проверку сериализуемости, если требуется
    }).concat(
      syncMiddleware as Middleware,
      ...(process.env.NODE_ENV === 'production'
        ? [forbiddenActionMiddleware as Middleware]
        : [
            loggingMiddleware as Middleware,
            forbiddenActionMiddleware as Middleware,
          ])
    )
  },
  devTools: process.env.NODE_ENV !== 'production',
})

// Определяем типы для  состояния и действий
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export default store
