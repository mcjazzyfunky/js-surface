import { Component, Props } from '../../../core/main/index'

export default function useProps<P extends Props>(self: Component<P>, defaultProps?: Partial<P>) {
  let
    originalProps = self.getProps(),
    adjustedProps = originalProps

  if (defaultProps) {
    adjustedProps = Object.assign({}, defaultProps, originalProps)
  }

  return () => {
    const props = self.getProps()

    if (props !== originalProps) {
      originalProps = props

      if (defaultProps) {
        adjustedProps = Object.assign({}, defaultProps, originalProps)
      } else {
        adjustedProps = originalProps
      }
    }

    return adjustedProps
  }
}
