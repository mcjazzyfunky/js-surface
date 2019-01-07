import useEffect from './useEffect'

export default function* usePrevious<T>(getCurrent: () => T) {
  let
    current: T = undefined,
    previous: T = undefined

  yield useEffect(() => {
    previous = current
    current = getCurrent()
  })

  return () => previous
}
