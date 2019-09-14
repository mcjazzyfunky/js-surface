// internal imports
import Methods from './types/Methods'
import _useImperativeHandle from '../internal/adaption/dyo/useImperativeHandle' 

// --- useImperativeHandle ------------------------------------------

function useImperativeHandle<M extends Methods>(ref: any, create: () => M, inputs?: any[]) {
  return _useImperativeHandle(ref, create, inputs)
}

// --- export -------------------------------------------------------

export default useImperativeHandle
