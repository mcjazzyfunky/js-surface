import Component from './Component'

type Context<T> = {
  Provider: any, // Component<{ value: T, children?: any }>, // TODO
  Consumer: any  //Component<{ children?: any }> // TODO
}

export default Context
