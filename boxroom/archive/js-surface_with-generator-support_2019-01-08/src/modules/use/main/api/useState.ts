import { Component } from '../../../core/main/index'

export default function useState<T>(c: Component, initialValue: T): [() => T, (newValue: T) => void] {
  return c.handleState(initialValue)
}
