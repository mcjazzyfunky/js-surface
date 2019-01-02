export default interface PropertyConfig<T> {
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
    : { new (...args: any[]): any } | ObjectConstructor

  nullable?: boolean,
  validate?: (value: T) => null | Error | true | false,
  required?: boolean,
  defaultValue?: T 
}
