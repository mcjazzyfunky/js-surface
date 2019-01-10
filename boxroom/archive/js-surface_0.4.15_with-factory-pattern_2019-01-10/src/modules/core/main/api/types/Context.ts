import ComponentFactory from './ComponentFactory'

export default interface Context<T> {
  Provider: ComponentFactory<{ value: T }>,
  Consumer: ComponentFactory<{}>
}
