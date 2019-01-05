import { Component, Context } from '../../../core/main/index'

export default function useContext<T>(self: Component, ctx: Context<T>) {
  return self.consumeContext(ctx)
}
