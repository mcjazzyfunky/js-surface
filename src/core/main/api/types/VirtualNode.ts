import VirtualElement from './VirtualElement'

type VirtualNode =
  undefined | null | boolean | number | string | Iterable<any> | VirtualElement

export default VirtualNode
