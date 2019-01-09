import { Dispatcher, Methods } from '../../../core/main/index'

export default function useMethods<M extends Methods>(ref: any, getMethods: () => M) {
  Dispatcher.useMethods(ref, getMethods)
}
