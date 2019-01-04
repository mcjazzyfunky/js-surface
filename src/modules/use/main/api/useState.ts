import { Component } from '../../../core/main/index'

export default function useState<T>(self: Component, initialValue: T): [() => T, (newValue: T) => void] {
  const
    valueKey = getNewValueKey(),

    get = () => self.getValue(valueKey),

    set = (newValue: T) => {
      self.setValue(valueKey, newValue)
    }

  self.setValue(valueKey, initialValue)

  return [get, set]
}

// -- locals --------------------------------------------------------

let nextValueId = 1

function getNewValueKey() {
  return Symbol(`#value-${nextValueId++}#`)
}