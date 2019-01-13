import Component from './types/Component'

export default function useState<T>(c: Component, initialValue: T): [() => T, (value: T) => void] {
   return c.handleState(initialValue)
}
