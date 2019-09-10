import Props from '../../api/types/Props'
import Component from '../../api/types/Component'
import Context from '../../api/types/Context'
import Children from '../../api/types/Children'
import VirtualElement from '../../api/types/VirtualElement'
import VirtualNode from '../../api/types/VirtualNode'

type Adapter = {
  createElement<P extends Props = {}>(
    type: string | Component<P>,
    props?: P,
    ...children: VirtualNode[]
  ): VirtualElement<P>,

  defineComponent<P extends Props = {}>(
    displayName: string,
    renderer: Function,
    memoize: boolean,
    validate: Function
  ): Component<P>,

  defineContext<T>(
    displayName: string,
    defaultValue: T,
    validate: Function
  ): Context<T>,

  isElement(it: any): boolean,

  childCount(
    children: Children
  ): number,

  forEachChild(
    children: Children,
    action: (child: VirtualNode) => void
  ): void,

  toChildArray(
    children: Children
  ): VirtualNode[],

  // TODO
  useCallback: Function,
  useContext: Function,
  useEffect: Function,
  useImperativeHandle: Function,
  useState: Function,
  useRef: Function,

  typeOf(elem: VirtualElement<string | Component<any>>): string | Component<any>,
  propsOf(elem: VirtualElement<string | Component<any>>): Props,

  mount(content: VirtualElement<any>, container: Element): void,
  unmount(container: Element): void,

  Fragment: any,
  Boundary: any
}

export default Adapter
