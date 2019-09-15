// external imports
import * as Dyo from 'dyo'

// --- useContext ---------------------------------------------------

function useContext(ctx) {
  let value = Dyo.useContext(ctx.Provider)

  if (value === undefined) {
    value = (ctx.constructor).__internal_defaultValue
  }

  return value
}

// --- exports ------------------------------------------------------

export default useContext
