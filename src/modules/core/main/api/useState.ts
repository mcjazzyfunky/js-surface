// internal imports
import getAdapter from '../internal/helpers/getAdapter'

// --- useState -----------------------------------------------------

function useState<T>(init: (() => T) | T): [T, (updater: (T | ((value: T) => T))) => void] {
  return adapter.useState(init) 
}

// --- locals -------------------------------------------------------

const adapter = getAdapter()

// --- exports ------------------------------------------------------

export default useState
