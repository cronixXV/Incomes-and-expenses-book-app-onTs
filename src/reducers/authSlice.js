import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import bcrypt from 'bcryptjs'

// Async thunk для входа
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/users?email=${email}`
      )

      if (!response.ok) {
        throw new Error('Ошибка при получении данных пользователя')
      }

      const users = await response.json()

      if (users.length === 0) {
        return rejectWithValue('Неверный email и/или пароль')
      }

      const user = users[0]
      const isValidPassword = bcrypt.compareSync(password, user.password)

      if (!isValidPassword) {
        return rejectWithValue('Неверный email и/или пароль')
      }

      const token = user.token || 'mockTokenForExample'

      return {
        isAuthenticated: true,
        user: { email: user.email, name: user.name },
        token,
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка при выполнении запроса')
    }
  }
)

// Async thunk для регистрации
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/users?email=${email}`
      )

      if (!response.ok) {
        throw new Error('Ошибка при проверке пользователя')
      }

      const existingUsers = await response.json()

      if (existingUsers.length > 0) {
        return rejectWithValue('Пользователь с таким email уже существует')
      }

      const hashedPassword = bcrypt.hashSync(password, 10)

      const newUser = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        name,
      }

      const saveResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        }
      )

      if (!saveResponse.ok) {
        throw new Error('Ошибка при сохранении пользователя')
      }

      const savedUser = await saveResponse.json()

      const token = 'mockTokenForExample'

      return {
        email: savedUser.email,
        name: savedUser.name,
        token,
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка при выполнении запроса')
    }
  }
)

// Async thunk для обновления имени пользователя
export const updateUserNameThunk = createAsyncThunk(
  'auth/updateUserName',
  async (newName, { getState, rejectWithValue }) => {
    const { user } = getState().auth
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/users/${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newName }),
        }
      )

      if (!response.ok) {
        throw new Error('Ошибка при обновлении имени пользователя')
      }

      const updatedUser = await response.json()
      return updatedUser.name
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    token: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.status = 'idle'
      // localStorage.removeItem('isAuthenticated')
      // localStorage.removeItem('token')
      // localStorage.removeItem('user')
    },
    updateUserName: (state, action) => {
      state.user.name = action.payload
      localStorage.setItem('user', JSON.stringify(state.user))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload && action.payload.user) {
          state.status = 'succeeded'
          state.isAuthenticated = action.payload.isAuthenticated
          state.user = action.payload.user
          state.token = action.payload.token
          localStorage.setItem('isAuthenticated', true)
          localStorage.setItem('token', action.payload.token)
          localStorage.setItem('user', JSON.stringify(action.payload.user))
        } else {
          state.status = 'failed'
          state.error = 'Неверный ответ от сервера'
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Ошибка при входе'
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = 'succeeded'
          state.isAuthenticated = true
          state.user = {
            email: action.payload.email,
            name: action.payload.name,
          }
          state.token = action.payload.token
          localStorage.setItem('isAuthenticated', true)
          localStorage.setItem('token', action.payload.token)
          localStorage.setItem('user', JSON.stringify(state.user))
        } else {
          state.status = 'failed'
          state.error = 'Неверный ответ от сервера'
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Ошибка при регистрации'
      })
      .addCase(updateUserNameThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateUserNameThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = 'succeeded'
          state.user.name = action.payload
          localStorage.setItem('user', JSON.stringify(state.user))
        } else {
          state.status = 'failed'
          state.error = 'Неверный ответ от сервера'
        }
      })
      .addCase(updateUserNameThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Ошибка при обновлении имени'
      })
  },
})

export const { logout, updateUserName } = authSlice.actions
export default authSlice.reducer
