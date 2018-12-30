import VirtualElement from './VirtualElement'
import StatefulComponentMeta from './StatefulComponentMeta'

type Props = { [name: string]: any } | null
type Methods = { [name: string]: any }

interface ComponentFactory<P extends Props = {}, M extends Methods = {}> {
  (type: string | ComponentFactory,
    props?: Props,
    ...children: any[]): VirtualElement,

  meta: StatefulComponentMeta<P, M>
}

export default ComponentFactory
