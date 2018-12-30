import StatelessComponentFactory from './StatelessComponentFactory'
import StatefulComponentFactory from './StatelessComponentFactory'
import Fragment from '../Fragment'

interface VirtualElement {
  type: string | StatelessComponentFactory | StatefulComponentFactory,
  props: { [name: string]: any } | null 
}

export default VirtualElement
