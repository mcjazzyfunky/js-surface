// external imports
import * as Dyo from 'dyo'

// internal imports
import Context from '../../../api/types/Context'

// --- useContext ---------------------------------------------------

function useContext<T>(ctx: Context<T>) {
  let value = Dyo.useContext(ctx.Provider)

  if (value === undefined) {
    value = (ctx.constructor as any).__internal_defaultValue
  }

  return value
}

// --- exports ------------------------------------------------------

export default useContext
