import { Context} from '../../../core/main'

export default interface Adapter {
  name: string,
  api: any,
  createElement: any,
  createContext: any,

  useContext: any,
  useEffect: any,
  useState: any,
  useMethods: any,

  mount: any,
  unmount: any,

  Fragment: any
}
