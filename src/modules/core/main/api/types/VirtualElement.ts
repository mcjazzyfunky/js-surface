import ComponentFactory from './ComponentFactory'
import AltComponentFactory from './ComponentFactory'
import Fragment from '../Fragment'

interface VirtualElement {
  type: string | ComponentFactory | AltComponentFactory,
  props: { [name: string]: any }
}

export default VirtualElement
