import { Component } from '../../../core/main/index'
import useEffect from './useEffect'

export default function usePrevious<T>(c: Component, getCurrent: () => T | undefined) {
  let
    current: T = undefined,
    previous: T = undefined

  useEffect(c, () => {
    previous = current
    current = getCurrent()
  })

  return () => previous
}
