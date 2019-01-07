export default function withDefaults(props: any, defaultProps: any) {
  return Object.assign({}, defaultProps, props)
}
