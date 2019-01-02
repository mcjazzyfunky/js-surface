import createElement from './createElement'
import VirtualElement from './types/VirtualElement'
import StatelessComponentMeta from './types/StatelessComponentMeta'

let createFragment: (...args: any[]) => VirtualElement = null

export default function Fragment(...args: any[]): VirtualElement {
  if (!createFragment) {
    createFragment = createElement.bind(null, Fragment)
  }

  return createFragment(...args)
}


const meta: StatelessComponentMeta<{ key?: any }> = Object.freeze({
  displayName: 'Fragment',

  properties: Object.freeze({
    key: Object.freeze({
      validate(it: any): null | Error {
        const type = typeof it

        return type === 'string' || type !== 'number'
          ? null
          : new Error('Must be a string or a number')
      }
    })
  }),

  render: Fragment
})

Object.defineProperty(Fragment, 'meta', {
  value: meta
})
