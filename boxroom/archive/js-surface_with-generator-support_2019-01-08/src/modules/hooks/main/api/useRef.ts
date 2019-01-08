import { Dispatcher } from '../../../core/main/index'

export default function useRef<T>(initialValue?: T): { current: T } {
  const [ret] = Dispatcher.useState(() => ({ current: initialValue}))

  return ret as any
}
