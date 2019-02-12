import Component from './types/Component'
import useState from './useState'
import useEffect from './useEffect'
import { VirtualNode } from '../../../../modules/core/main'
import useForceUpdate from './useForceUpdate'

type Data = Record<string, any>
type Getters<T extends Data> = { [K in keyof T]: () => T[K]} 
type View<T extends Data> = (render: (data: T) => VirtualNode) => () => VirtualNode


function useData<T extends Data>(c: Component, getters: Getters<T>): [T, T, View<T>] {
  const
    curr: T = {} as T,
    prev: T = {} as T,
    view: View<T> = (render: (data: T) => VirtualNode) => () => render(curr),
    [, setDummy] = useState(c, false)

  updateDataObject(curr, getters)
  clearDataObject(prev, getters)

  useEffect(c, () => {
    setDummy((it: boolean) => {
      Object.assign(prev, curr)
      updateDataObject(curr, getters)
      return !it
    })
  })

  return [curr, prev, view]
}

function updateDataObject(obj: any, getters: any) {
  for (let propName in getters) {
    if (getters.hasOwnProperty(propName)) {
      obj[propName] = getters[propName]()
    }
  }
}

function clearDataObject(obj: any, getters: any) {
  for (let propName in getters) {
    if (getters.hasOwnProperty(propName)) {
      obj[propName] = undefined 
    }
  }
}

export default useData
