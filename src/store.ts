// import { configureStore } from '@reduxjs/toolkit'
// import rootReducer from './reducers'
// import loggingMiddleware from './middleware/loggingMiddleware'
// import forbiddenActionMiddleware from './middleware/forbiddenActionMiddleware'
// import syncMiddleware from './middleware/syncMiddleware'

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(
//       syncMiddleware,
//       ...(process.env.NODE_ENV === 'production'
//         ? [forbiddenActionMiddleware]
//         : [loggingMiddleware, forbiddenActionMiddleware])
//     ),
//   devTools: process.env.NODE_ENV !== 'production',
// })

// export type AppDispatch = typeof store.dispatch
// export type RootState = ReturnType<typeof store.getState>
// export default store

import { configureStore, Middleware } from '@reduxjs/toolkit'
import rootReducer from './reducers'
import loggingMiddleware from './middleware/loggingMiddleware'
import forbiddenActionMiddleware from './middleware/forbiddenActionMiddleware'
import syncMiddleware from './middleware/syncMiddleware'

// Определяем типы для  состояния и действий
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
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

export default store
