import VirtualElement from './api/types/VirtualElement'

declare  module JSX {
    type Element = VirtualElement 
  
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

declare module 'react'
declare module 'react-dom'