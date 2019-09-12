type ComponentOptions = {
  forwardRef?: boolean,
  memoize?: boolean,
  validate?: (props: any) => boolean | null | Error
}

export default ComponentOptions
