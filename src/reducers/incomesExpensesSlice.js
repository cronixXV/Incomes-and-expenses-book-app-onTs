import { createSlice } from '@reduxjs/toolkit'

const incomesExpensesSlice = createSlice({
  name: 'incomesExpenses',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchDataStart(state) {
      state.loading = true
      state.error = null
    },
    fetchDataSuccess(state, action) {
      state.loading = false
      state.data = Array.isArray(action.payload)
        ? action.payload
        : [...state.data, action.payload]
    },
    fetchDataFail(state, action) {
      state.loading = false
      state.error = action.payload
    },

    //Reducer для удаления
    deleteItemSuccess(state, action) {
      state.data = state.data.filter((item) => item.id !== action.payload)
    },

    //Reducer для редактирования
    editItemSuccess(state, action) {
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

export const fetchIncomesExpenses = () => async (dispatch) => {
  dispatch(fetchDataStart())
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/incomes_expenses`
    )
    const data = await response.json()
    dispatch(fetchDataSuccess(data))
  } catch (error) {
    dispatch(fetchDataFail(error.message))
  }
}

// One Item
export const fetchIncomesExpensesById = (id) => async (dispatch, getState) => {
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
    const data = await response.json()
    dispatch(fetchDataSuccess(data))
  } catch (error) {
    dispatch(fetchDataFail(error.message))
  }
}

//  Action для удаления записи
export const deleteIncomesExpensesById = (id) => async (dispatch) => {
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

//  Action для обновления записи
export const editIncomesExpensesById = (id, editedData) => async (dispatch) => {
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

    const editedItem = await response.json()
    dispatch(editItemSuccess(editedItem))
  } catch (error) {
    console.error('Ошибка обновления:', error)
  }
}
