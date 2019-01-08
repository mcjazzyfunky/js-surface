import { Component, Context } from '../../../core/main/index'

export default function useContext<T>(c: Component, ctx: Context<T>) {
  return c.consumeContext(ctx)
}
