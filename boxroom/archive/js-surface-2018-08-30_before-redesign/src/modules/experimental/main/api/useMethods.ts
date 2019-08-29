import Component from './types/Component'
import { Methods } from '../../../core/main'

export default function useMethods<M extends Methods>(c: Component, ref: any, create: () => M, getInputs?: () => any[]) {
  return c.handleMethods(ref, create, getInputs)
}
