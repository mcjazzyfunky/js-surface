import VirtualElement from './api/types/VirtualElement'

declare global {
  module JSX {
    type Element =  VirtualElement<any>

    interface IntrinsicElements {
      [key: string]: any
    }
  }
}
