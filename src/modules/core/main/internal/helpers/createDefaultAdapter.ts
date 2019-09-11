import Adapter from '../types/Adapter'
import Fragment from '../../api/Fragment'
import Boundary from '../../api/Boundary'

function createDefaultAdapter(): Adapter {
  const ret: Adapter = {
    type: undefined,
    createElement: throwAdapterError,
    defineComponent: throwAdapterError,
    defineContext: throwAdapterError, 

    isElement: throwAdapterError,
    typeOf: throwAdapterError,
    propsOf: throwAdapterError,

    forEachChild: throwAdapterError,
    childCount: throwAdapterError,
    toChildArray: throwAdapterError,

    useCallback: throwAdapterError,
    useContext: throwAdapterError,
    useEffect: throwAdapterError,
    useImperativeHandle: throwAdapterError,
    useRef: throwAdapterError,
    useState: throwAdapterError,

    Boundary: undefined as any,
    Fragment: undefined as any,
    
    mount: throwAdapterError,
    unmount: throwAdapterError
  }

  return ret
}
// --- locals -------------------------------------------------------

const throwAdapterError: any = () => {
  throw new Error('The UI adapter has not been initialized')
}

// --- exports ------------------------------------------------------

export default createDefaultAdapter