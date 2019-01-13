import Component from './types/Component'
import useState from './useState'
import useEffect from './useEffect'
import useForceUpdate from './useForceUpdate'


function useData<T extends { [K in keyof T]: () => ReturnType<T[K]> }>(
  c: Component,
  source: T,
  action: (current: { [K in keyof T]: ReturnType<T[K]> }, previous: { [K in keyof T]: ReturnType<T[K]>}) => void
): [ { [K in keyof T]: ReturnType<T[K]> }, { [K in keyof T]: ReturnType<T[K]> } ]

function useData<T>(c: Component, get: () => T, action: (current: T, previous: T) => void): [T, T | undefined]

function useData(c: Component, source: any, action: (current: any, previous: any) => void) {
  let ret: any

  if (typeof source === 'function') {
    ret = useSingleData(c, source, action) 
  } else {
    ret = useMultiData(c, source, action)
  }

  return ret
}

export default useData

// --- local --------------------------------------------------------

function useSingleData<T>(c: Component, get: () => T, action: (current: T, previous: T) => void): [T, T | undefined] {
  let
    current: T = get(),
    previous: T = undefined

  useEffect(c, () => {
    previous = current
    current = get()

    action(current, previous)
  })

  action(current, undefined)

  return [current, undefined]
}

function useMultiData<T>(c: Component, source: { [key: string]: () => any}, action: (current: T, previous: T) => void): [T, T | undefined] {
  const
    keys = Object.keys(source)

  function get() {
    const ret: any = {}

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i]

      ret[key] = source[key]()
    }

    return ret
  }

  let
    current: any = get(),
    previous: any = undefined

  useEffect(c, () => {
    previous = current
    current = get()

    action(current, previous)
  })

  action(current, undefined)
  
  return [current, undefined]
}
