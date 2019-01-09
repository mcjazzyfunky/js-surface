declare module 'react'
declare module 'react-dom'

// TODO
declare module JSX {
   type Element = any

  interface IntrinsicElements {
    [key: string]: any
  }
}
