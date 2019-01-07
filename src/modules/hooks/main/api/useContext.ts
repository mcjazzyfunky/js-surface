import { Dispatcher, Context } from '../../../core/main/index'

export default function useContext<T>(ctx: Context<T>): T {
  return Dispatcher.useContext(ctx)
}
