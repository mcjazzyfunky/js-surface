interface ContextConfig<T> {
  displayName: string,

  type?: 
    T extends string
    ? StringConstructor 
    : T extends number 
    ? NumberConstructor 
    : T extends boolean
    ? BooleanConstructor
    : T extends Function
    ? FunctionConstructor
    : T extends Symbol
    ? SymbolConstructor
    : { new (...args: any[]): T } | ObjectConstructor

  nullable?: boolean,
  validate?: (value: T) => null | Error | true | false
  defaultValue: T
}

export default ContextConfig
