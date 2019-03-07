import defineComponent from './defineComponent'
import isNode from './isNode'

type BoundaryProps = {
  handle: (exception: any) => void,
  children?: any // TODO
}

const Boundary = defineComponent<BoundaryProps>({
  displayName: 'Boundary',

  properties: {
    handle: {
      type: Function,
      required: true
    },

    children: {
      validate: isNode
    }
  },

  render(props) {
    delegate = delegate || (Boundary as any).__apply  

    if (!delegate) {
      throw new Error('[Boundary] Adapter has not been initialized')
    }

    return delegate(props)
  }
})

// --- locals -------------------------------------------------------

let delegate: any = null // TODO

//--- exports -------------------------------------------------------

export default Boundary
