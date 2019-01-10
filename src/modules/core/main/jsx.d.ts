import VirtualElement from './api/types/VirtualElement'

declare  module JSX {
  type Element = any 

  interface IntrinsicElements {
    [key: string]: any
  }
}
