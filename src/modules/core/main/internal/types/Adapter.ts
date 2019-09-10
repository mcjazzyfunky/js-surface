type Adapter = {
  createElement(type: any, props?: any, ...children: any[]): any,

  defineComponent(displayName: string, renderer: Function, memoize: boolean, validate: Function): Function,
  defineContext(displayName: string, defaultValue: any, validate: Function): any,

  isElement(it: any): boolean,
  childCount(it: any): number,
  forEachChild(children: any, action: (child: any) => void): void,
  toChildArray: Function

  useCallback: Function,
  useContext: Function,
  useEffect: Function,
  useImperativeMethods: Function,
  useState: Function,
  useRef: Function,

  typeOf: Function,
  propsOf: Function,

  mount: Function,
  unmount: Function,

  Fragment: any,
  Boundary: any
}

export default Adapter
