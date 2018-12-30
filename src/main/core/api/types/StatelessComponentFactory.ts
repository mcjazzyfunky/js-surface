import VirtualElement from './VirtualElement'

type Props = { [name: string]: any } | null
type Methods = { [name: string]: any }

interface ComponentFactory<P extends Props = {}, M extends Methods = {}> {
  (type: string | ComponentFactory,
    props?: Props,
    ...children: any[]): VirtualElement,

  meta: {
    properties?: {
      type?: { (...args: any[]): any }
      nullable?: boolean,
      required?: boolean,
      defaultValue: any
    }

    // TODO
  }
}

export default ComponentFactory
