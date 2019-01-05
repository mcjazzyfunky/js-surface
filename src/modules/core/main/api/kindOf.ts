import Kind from './types/Kind'
import createElement from './createElement'
import defineContext from './defineContext'

export default function kindOf(it: any): Kind | null {
  let ret: Kind | null = null

  if (it instanceof VirtualElementClass) {
    ret = 'element' 
  } else if (it instanceof ContextClass) {
    ret = 'context'
  } else if (it) {
    const kind = it['js-surface:kind'] as Kind || null

    if (kind) {
      ret = kind
    }
  }

  return ret
}

// --- locals -------------------------------------------------------


const
  VirtualElementClass = createElement('div').constructor,
  ContextClass = defineContext({ displayName: 'DummyCtx', defaultValue: null }).constructor

