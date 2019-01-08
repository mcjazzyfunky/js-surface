import { Component, Props } from '../../../core/main/index'

export default function useProps<P extends Props>(c: Component<P>, defaultProps?: Partial<P>) {
  let
    originalProps = c.props,
    adjustedProps = originalProps

  if (defaultProps) {
    adjustedProps = Object.assign({}, defaultProps, originalProps)
  }

  return () => {
    const props = c.props

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
