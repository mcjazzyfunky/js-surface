import { VirtualElement } from '../modules/core/main/index'

declare module JSX {
   type Element = VirtualElement

  interface IntrinsicElements {
    [key: string]: any
  }
}
