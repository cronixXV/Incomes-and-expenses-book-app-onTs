import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'
import loggingMiddleware from './middleware/loggingMiddleware'
import forbiddenActionMiddleware from './middleware/forbiddenActionMiddleware'
import syncMiddleware from './middleware/syncMiddleware'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    syncMiddleware,
    ...(process.env.NODE_ENV === 'production'
      ? [forbiddenActionMiddleware]
      : [loggingMiddleware, forbiddenActionMiddleware]),
  ],
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
