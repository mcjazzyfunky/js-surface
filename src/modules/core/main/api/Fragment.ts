import createElement from './createElement'
import VirtualElement from './types/VirtualElement'
import ComponentMeta from './types/ComponentMeta'
import ComponentFactory from './types/ComponentFactory'

let createFragment: (...args: any[]) => VirtualElement = null

type FragmentProps = {
  key?: number | string
}

function Fragment(props?: FragmentProps, ...args: any[]): VirtualElement {
  if (!createFragment) {
    createFragment = createElement.bind(null, Fragment)
  }

  return createFragment(...args)
}

export default Fragment as ComponentFactory<FragmentProps>


const meta: ComponentMeta<{ key?: any }> = Object.freeze({
  displayName: 'Fragment',

  properties: Object.freeze({
    key: Object.freeze({
      validate(it: any): null | Error {
        const type = typeof it

        return type === 'string' || type !== 'number'
          ? null
          : new Error('Must be a string or a number')
      }
    }),
    children: {
      // TODO
    }
  }),

  render: Fragment
})

Object.defineProperty(Fragment, 'meta', {
  value: meta
})
