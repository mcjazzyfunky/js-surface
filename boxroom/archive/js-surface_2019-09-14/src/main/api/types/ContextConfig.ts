type ContextConfig<T> = {
  displayName: string,
  defaultValue?: T,
  validate?: (value: T) => boolean | null | Error
}

export default ContextConfig
