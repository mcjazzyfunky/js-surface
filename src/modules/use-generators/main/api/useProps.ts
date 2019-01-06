export default function* useProps(defaultProps?: any) {
  const getProps = yield {
    type: 'handleProps'
  }

  let
    originalProps = getProps(),
    adjustedProps = originalProps

  if (defaultProps) {
    adjustedProps = Object.assign({}, defaultProps, originalProps)
  }

  return () => {
    const props = getProps()

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
