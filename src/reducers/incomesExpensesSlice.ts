import {
  UnknownAction,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '../store'

export interface IncomesExpensesItem {
  id: number
  title: string
  description: string
  amount: number
  type: number
  category: string
  date: string
}

interface IncomesExpensesState {
  data: IncomesExpensesItem[]
  loading: boolean
  error: string | null
}

const initialState: IncomesExpensesState = {
  data: [],
  loading: false,
  error: null,
}

const incomesExpensesSlice = createSlice({
  name: 'incomesExpenses',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.loading = true
      state.error = null
    },
    fetchDataSuccess(
      state,
      action: PayloadAction<IncomesExpensesItem | IncomesExpensesItem[]>
    ) {
      state.loading = false
      state.data = Array.isArray(action.payload)
        ? action.payload
        : [...state.data, action.payload]
    },
    fetchDataFail(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    deleteItemSuccess(state, action: PayloadAction<number>) {
      state.data = state.data.filter((item) => item.id !== action.payload)
    },
    editItemSuccess(state, action: PayloadAction<IncomesExpensesItem>) {
      state.data = state.data.map((item) =>
        item.id === action.payload.id ? action.payload : item
      )
    },
  },
})

export const {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFail,
  deleteItemSuccess,
  editItemSuccess,
} = incomesExpensesSlice.actions

export default incomesExpensesSlice.reducer

export const fetchIncomesExpenses = () => async (dispatch: AppDispatch) => {
  dispatch(fetchDataStart())
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/incomes_expenses`
    )
    const data: IncomesExpensesItem[] = await response.json()
    dispatch(fetchDataSuccess(data))
  } catch (error) {
    dispatch(fetchDataFail((error as Error).message))
  }
}

export const fetchIncomesExpensesById =
  (id: number): ThunkAction<void, RootState, undefined, UnknownAction> =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { data } = getState().incomesExpenses
    const item = data.find((item) => item.id === id)

    if (item) {
      return
    }

    dispatch(fetchDataStart())
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/incomes_expenses/${id}`
      )
      const data: IncomesExpensesItem = await response.json()
      dispatch(fetchDataSuccess(data))
    } catch (error) {
      dispatch(fetchDataFail((error as Error).message))
    }
  }

export const deleteIncomesExpensesById =
  (id: number): ThunkAction<void, RootState, undefined, UnknownAction> =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/incomes_expenses/${id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Ошибка при удалении записи')
      }

      dispatch(deleteItemSuccess(id))
    } catch (error) {
      console.error('Ошибка удаления:', error)
    }
  }

export const editIncomesExpensesById =
  (
    id: number,
    editedData: Partial<IncomesExpensesItem>
  ): ThunkAction<void, RootState, undefined, UnknownAction> =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/incomes_expenses/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedData),
        }
      )

      if (!response.ok) {
        throw new Error('Ошибка при обновлении записи')
      }

      const editedItem: IncomesExpensesItem = await response.json()
      dispatch(editItemSuccess(editedItem))
    } catch (error) {
      console.error('Ошибка обновления:', error)
    }
  }
