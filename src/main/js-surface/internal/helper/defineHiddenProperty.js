export default function defineHiddenProperty(subject, propName, value) {
  return Object.defineProperty(subject, propName, {
    enumerable: false,
    configurable: false,
    writable: false,
    value
  })
}
