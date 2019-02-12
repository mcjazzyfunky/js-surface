import { Dispatcher } from '../../../core/main/index'

export default function useState<T>(init: () => T): [T, (updater: (T | ((value: T) => T))) => void] {
  return Dispatcher.useState(init) 
}
