import VirtualElement from './VirtualElement'
import StatefulComponentMeta from './StatefulComponentMeta'
import Props from './Props'
import Methods from './Methods'

type ExtProps<P extends Props> = P & {
  key?: string | number,
  ref?: any // TODO
}

export default interface StatefulComponentFactory<P extends Props = {}, M extends Methods = {}> {
  (props?: ExtProps<P>, ...children: any[]): VirtualElement,
  meta: StatefulComponentMeta<P, M>
}
