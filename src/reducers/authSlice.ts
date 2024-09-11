import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import bcrypt from 'bcryptjs'
import { RootState } from '../store'

interface User {
  id: string
  email: string
  name: string
  password?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

// Начальное состояние
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  status: 'idle',
  error: null,
}

// Async thunk для входа
export const login = createAsyncThunk<
  { isAuthenticated: boolean; user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
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
      user: { id: user.id, email: user.email, name: user.name },
      token,
    }
  } catch (error) {
    return rejectWithValue(
      (error as Error).message || 'Ошибка при выполнении запроса'
    )
  }
})

// Async thunk для регистрации
export const register = createAsyncThunk<
  { email: string; name: string; token: string },
  { email: string; password: string; name: string },
  { rejectValue: string }
>('auth/register', async ({ email, password, name }, { rejectWithValue }) => {
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

    const newUser: User = {
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
    return rejectWithValue(
      (error as Error).message || 'Ошибка при выполнении запроса'
    )
  }
})

// Async thunk для обновления имени пользователя
export const updateUserNameThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>('auth/updateUserName', async (newName, { getState, rejectWithValue }) => {
  const { user } = getState().auth
  if (!user) {
    return rejectWithValue('Пользователь не найден')
  }

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
    return rejectWithValue((error as Error).message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.status = 'idle'
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.name = action.payload
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.isAuthenticated = action.payload.isAuthenticated
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
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
        state.status = 'succeeded'
        state.isAuthenticated = true
        state.user = {
          id: Date.now().toString(),
          email: action.payload.email,
          name: action.payload.name,
        }
        state.token = action.payload.token
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(state.user))
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Ошибка при регистрации'
      })
      .addCase(updateUserNameThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateUserNameThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (state.user) {
          state.user.name = action.payload
          localStorage.setItem('user', JSON.stringify(state.user))
        }
      })
      .addCase(updateUserNameThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Ошибка при обновлении имени'
      })
  },
})

export const { logout, updateUserName } = authSlice.actions
export type AppActions = ReturnType<
  (typeof authSlice.actions)[keyof typeof authSlice.actions]
>
export default authSlice.reducer
