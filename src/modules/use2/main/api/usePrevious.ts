import useEffect from './useEffect'

export default function* usePrevious<T>(getCurrent: () => T) {
  let
    current = getCurrent(),
    previous: T = undefined

  yield useEffect(() => {
    previous = current
    current = getCurrent()
  })

  return () => previous
}
