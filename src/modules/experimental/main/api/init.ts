import Component from './types/Component'
import { Context, Methods, Props, VirtualNode, Dispatcher } from '../../../core/main'

export default function init<P extends Props = {}, M extends Methods = {}>
  (f: (c: Component<P, M>) => ((props: P) => VirtualNode)): ((props: P) => VirtualNode) {
    let
      currentProps: P,
      render: (props: P) => VirtualNode,
      states: [any, any, any][] = [],
      effects: [any, any][] = [],
      contexts: [any, any][] = []

    const component: Component<P, M> = {
      get props(): P {
        return currentProps 
      },

      handleState<T>(value: T): [() => T, (value: T) => void] {
        const index = states.length

        states[index] = [() => value, null, null]

        function get(): T {
           return states[index][1]
        }
        
        function set(value: T) {
          return states[index][2](value)
        }

        return [get, set]
      },

      handleEffect(action: () => void, getDeps: () => any[] = null): void {
        effects.push([action, getDeps])
      },

      consumeContext<T>(ctx: Context<T>): () => T {
        const index = contexts.length

        contexts[index] = [ctx, undefined]

        return () => contexts[index][1]
      },

      setMethods(methods: M) {
        // TODO
      }
    }

    return (props: P) => {
      currentProps = props
    
      if (!render) {
        render = f(component)
      }

      for (let i = 0; i < states.length; ++i) {
        const [value, setValue] = Dispatcher.useState(states[i][0])

        states[i][1] = value
        states[i][2] = setValue
      }

      for (let i = 0; i < effects.length; ++i) {
        const
          effect = effects[i][0],
          deps = effects[i][1] ? effects[i][1]() : undefined

        Dispatcher.useEffect(effect, deps)
      }

      for (let i = 0; i < contexts.length; ++i) {
        contexts[i][1] = Dispatcher.useContext(contexts[i][0])
      }

      return render(props)
    }
}
