import { Context, Methods, Props } from '../../../../core/main'

export default interface Component<P extends Props = {}, M extends Methods = {}> {
  props: P,
  handleState<T>(value: T): [() => T, (value: T) => void],
  handleEffect(action: () => void, getDeps?: () => any[]): void
  consumeContext<T>(ctx: Context<T>): () => T,
  setMethods(methods: M): void
}
