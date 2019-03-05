import { Dispatcher, Methods } from '../../../core/main/index'

export default function useMethods<M extends Methods>(ref: any, create: () => M, inputs?: any[]) {
  Dispatcher.useMethods(ref, create, inputs)
}
