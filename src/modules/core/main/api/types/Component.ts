import Context from './Context'
import Props from './Props'
import Methods from './Methods'

type Listener = () => void
type Unsubscribe = () => void

export default interface Component<P extends Props = {}, M extends Methods = {}> {
  props: P,
  setValue: (key: string | Symbol, value: any) => void,
  getValue: (key: string | Symbol) => any,
  update(): void,
  onDidMount(listener: Listener): Unsubscribe,
  onDidUpdate(listener: Listener): Unsubscribe,
  onWillUnmount(listener: Listener): Unsubscribe,
  onDidChangeContext(ctx: Context<any>, listener: Listener): Unsubscribe,
  setMethodsHandler(handler: M): void
}
