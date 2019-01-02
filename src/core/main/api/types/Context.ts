import StatelessComponentFactory from './StatelessComponentConfig'

export default interface Context<T> {
  Provider: StatelessComponentFactory<{ value: T }>,
  Consumer: StatelessComponentFactory<{}>
}
