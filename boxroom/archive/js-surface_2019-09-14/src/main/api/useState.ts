// internal imports
import _useState from '../internal/adaption/dyo/useState'

// --- useState -----------------------------------------------------

function useState<T>(init: (() => T) | T): [T, (updater: (T | ((value: T) => T))) => void] {
  return _useState(init) 
}

// --- exports ------------------------------------------------------

export default useState
