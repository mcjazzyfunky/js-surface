import ComponentFactory from './ComponentFactory'
import Props from './Props'
import Key from './Key'
import Ref from './Ref'

interface VirtualElement {
  type: string | ComponentFactory
  props: Props | null,
  key: Key,
  ref: Ref
}

export default VirtualElement
