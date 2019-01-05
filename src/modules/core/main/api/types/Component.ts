import Context from './Context'
import Props from './Props'
import Methods from './Methods'

type Listener = () => void
type Unsubscribe = () => void

export default interface Component<P extends Props = {}, M extends Methods = {}> {
  getProps(): P,
  setValue<T = any>(key: string | Symbol, value: T): void,
  getValue<T = any>(key: string | Symbol): T,
  forceUpdate(): void,
  setMethodsHandler(handler: M): void
  consumeContext<T = any>(ctx: Context<T>): () => T,
  onDidMount(listener: Listener): Unsubscribe,
  onDidUpdate(listener: Listener): Unsubscribe,
  onWillUnmount(listener: Listener): Unsubscribe,
}
