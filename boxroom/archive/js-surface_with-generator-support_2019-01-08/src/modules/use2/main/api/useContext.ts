import { Context } from '../../../core/main/index'

export default function* useContext<T>(ctx: Context<T>) {
  return yield {
    type: 'handleContext',
    context: ctx
  }
}
