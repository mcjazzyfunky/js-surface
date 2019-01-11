import Component from './types/Component'
import { Context, Methods } from '../../../core/main'

function useState<T>(c: Component, initialValue: T): [() => T, (value: T) => void] {
   return c.handleState(initialValue)
}

function useContext<T>(c: Component, ctx: Context<T>): () => T {
   return c.consumeContext(ctx)
}

function useEffect(c: Component, action: () => void, getDeps?: () => any[]) {
   return c.handleEffect(action, getDeps)
}

function useMethods<M extends Methods>(c: Component, ref: any, create: () => M, getInputs?: () => any[]) {
  return c.handleMethods(ref, create, getInputs)
}

function usePrevious() {
}

export default {
   useContext,
   useEffect,
   useMethods,
   usePrevious,
   useState,
}
