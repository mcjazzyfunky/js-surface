import StatelessComponentFactory from './StatelessComponentConfig'

export default interface Context<T> {
  Provider: StatelessComponentFactory<any>, // TODO
  Consumer: StatelessComponentFactory<any> // TODO
}
