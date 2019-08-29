import useState from './useState'

export default function useRef<T>(initialValue?: T): { current: T } {
  const [ret] = useState(() => ({ current: initialValue}))

  return ret as any
}
