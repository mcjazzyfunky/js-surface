
// TODO: Completely not really working as expected
export default function useDyoImperativeHandle(ref, getHandler/*, deps*/) {
  const handler = getHandler() // TODO

  if (ref && typeof ref === 'object') {
    ref.current = handler
  } else if (typeof ref === 'function') {
    ref(handler)
  }
}