export default function createRef() {
  const ret = {
    current: null as any
  }

  if (process.env.NODE_ENV === 'development' as any) {
    Object.seal(ret)
  }

  return ret
}
