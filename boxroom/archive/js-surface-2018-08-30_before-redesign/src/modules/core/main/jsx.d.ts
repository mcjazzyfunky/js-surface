import VirtualElement from './api/types/VirtualElement'

declare global {
  module JSX {
    type Element = VirtualElement 

    interface IntrinsicElements {
      [key: string]: any
    }
  }
}
