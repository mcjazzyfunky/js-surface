export default function* (initialValue: any) {
  return yield {
    type: 'handleState',
    initialValue
  }
}
