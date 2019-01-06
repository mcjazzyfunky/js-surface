import { Component } from '../../../core/main/index'
import useEffect from './useEffect'

export default function usePrevious<T>(self: Component, getCurrent: () => T) {
  let
    current = getCurrent(),
    previous: T = undefined

  useEffect(self, () => {
    previous = current
    current = getCurrent()
  })

  return () => previous
}
