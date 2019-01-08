import Context from './Context'
import Props from './Props'
import Methods from './Methods'

type Listener = () => void
type Unsubscribe = () => void

export default interface Component<P extends Props = {}, M extends Methods = {}> {
  props: P,
  // Would it make sense to add a "prevProps" property
  // as sugar for convenience reasons???
  handleState<T>(initialValue: T): [() => T, (newValue: T) => void],
  forceUpdate(): void,
  setMethods(methods: M): void
  consumeContext<T = any>(ctx: Context<T>): () => T,
  onDidMount(listener: Listener): Unsubscribe,
  onDidUpdate(listener: Listener): Unsubscribe,
  onWillUnmount(listener: Listener): Unsubscribe,
  // plus some more methods (mostly for lifecycle)
}
