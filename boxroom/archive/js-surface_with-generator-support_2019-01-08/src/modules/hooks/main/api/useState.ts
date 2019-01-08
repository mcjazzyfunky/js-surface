import { Dispatcher } from '../../../core/main/index'

export default function useState<T>(init: () => T): [T, (newValue: T) => void] {
  return Dispatcher.useState(init) 
}
