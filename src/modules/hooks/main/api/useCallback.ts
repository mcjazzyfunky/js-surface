import { Dispatcher } from '../../../core/main/index'

export default function useCallback<T = void>(callback: (...args: any[]) => T, inputs?: any[]): (...args: any[]) => any {
  const [ret] = Dispatcher.useState(() => callback)

  return ret
}
