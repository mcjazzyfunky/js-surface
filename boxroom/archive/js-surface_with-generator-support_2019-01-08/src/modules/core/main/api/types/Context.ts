import StatelessComponentFactory from './StatelessComponentFactory'

export default interface Context<T> {
  Provider: StatelessComponentFactory<{ value: T }>,
  Consumer: StatelessComponentFactory<{}>
}
