import { Component } from '../../../core/main/index'

export default function useState<T>(self: Component, initialValue: T): [() => T, (newValue: T) => void] {
  return self.handleState(initialValue)
}
