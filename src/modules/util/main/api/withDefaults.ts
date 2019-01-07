export default function withDefaults(props: any, defaultProps: any) {
  return Object.assign({}, props, defaultProps)
}
