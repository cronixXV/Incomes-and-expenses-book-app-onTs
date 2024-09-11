import { Dispatch, UnknownAction } from 'redux'

const forbiddenActionTypes = new Set(['incomesExpenses/fetchDataSuccess2'])

const forbiddenActionMiddleware =
  () => (next: Dispatch<UnknownAction>) => (action: UnknownAction) => {
    if (forbiddenActionTypes.has(action.type)) {
      console.info(
        `Действие ${action.type} не разрешено, поэтому оно не может быть выполнено.`
      )
      return
    }

    return next(action)
  }

export default forbiddenActionMiddleware
