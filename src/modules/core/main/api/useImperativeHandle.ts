import Methods from './types/Methods'
import getAdapter from '../internal/helpers/getAdapter' 

export default function useImperativeHandle<M extends Methods>(ref: any, create: () => M, inputs?: any[]) {
  return adapter.useImperativeHandle(ref, create, inputs)
}

const adapter = getAdapter()
