import Component from './types/Component'
import { Context } from '../../../core/main'

export default function useContext<T>(c: Component, ctx: Context<T>): () => T {
   return c.consumeContext(ctx)
}
