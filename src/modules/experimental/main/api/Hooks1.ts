import Component from './types/Component'
import { Context } from '../../../core/main'

function useState<T>(c: Component, initialValue: T): [() => T, (value: T) => void] {
   return c.handleState(initialValue)
}

function useContext<T>(c: Component, ctx: Context<T>): () => T {
   return c.consumeContext(ctx)
}

function useEffect(c: Component, action: () => void, getDeps?: () => any[]) {
   return c.handleEffect(action, getDeps)
}

function usePrevious() {
}

export default {
   useState,
   useContext,
   useEffect,
   usePrevious
}
