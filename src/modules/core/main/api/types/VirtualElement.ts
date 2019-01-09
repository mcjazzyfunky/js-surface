import ComponentFactory from './ComponentFactory'
import AltComponentFactory from './ComponentFactory'
import Props from './Props'
import Key from './Key'
import Ref from './Ref'

interface VirtualElement {
  type: string | ComponentFactory | AltComponentFactory,
  props: Props | null,
  key: Key,
  ref: Ref
}

export default VirtualElement
