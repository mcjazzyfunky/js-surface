import { Dispatcher } from '../../../core/main/index'

export default function useEffect(effect: () => void, inputs?: any[]): void {
  Dispatcher.useEffect(effect, inputs)
}
