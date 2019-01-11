import { Context} from '../../../core/main'

export default interface Adapter {
  createElement: any,
  createContext: any,
  forwardRef: any,

  useContext: any,
  useEffect: any,
  useState: any,
  useMethods: any,

  mount: any,
  unmount: any,

  Fragment: any
}
