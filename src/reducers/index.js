import { combineReducers } from '@reduxjs/toolkit'
import incomesExpensesSlice from './incomesExpensesSlice'
import authSlice from './authSlice'

const rootReducer = combineReducers({
  incomesExpenses: incomesExpensesSlice,
  auth: authSlice,
})

export default rootReducer
