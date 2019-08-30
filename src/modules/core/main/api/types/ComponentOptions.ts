type ComponentOptions = {
  memoize?: boolean,
  validate?: (props: any) => boolean | null | Error
}

export default ComponentOptions
