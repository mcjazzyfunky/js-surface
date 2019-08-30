import { Spec } from 'js-spec'

import createElement from './createElement'
import component from './component'
import isNode from './isNode'


const Boundary = {} as any // TODO
/*
type BoundaryProps = {
  handle: (exception: any) => void,
  children?: any // TODO
}

const Boundary: any = component<BoundaryProps>({ // TODO
  displayName: 'Boundary',

  validate: Spec.checkProps({
    required: {
      handle: Spec.function
    },
    optional: {
      children: isNode
    }
  }),

  render(props) {
    const delegate: any = (createElement as any).__boundary

    if (!delegate) {
      throw new Error('[Boundary] Adapter has not been initialized')
    }

    return delegate(props)
  }
})
*/

//--- exports -------------------------------------------------------

export default Boundary
