export type Children = OpaqueType<'Children'>

export type Component<P extends Props> = OpaqueType<'Component'>

export type ComponentConfig<P extends Props> = {
  displayName: string,
  forwardRef?: boolean,
  memoize?: boolean,
  validate?(props: P): boolean | null | Error
  render(props: P): VirtualNode
}

export type ComponentOptions = {
  forwardRef?: boolean,
  memoize?: boolean,
  validate?: (props: any) => boolean | null | Error
}

export type Context<T> = {
  Provider: any, // Component<{ value: T, children?: any }>, // TODO
  Consumer: any  //Component<{ children?: any }> // TODO
}

export type ContextConfig<T> = {
  displayName: string,
  defaultValue?: T,
  validate?: (value: T) => boolean | null | Error
}

export type ContextOptions = {
  validate?: (value: any) => boolean | null | Error
}

export type Key = number | string | null

export type Methods = {
  [name: string]: (...args: any[]) => any 
}
  
export type Props = {
  [name: string]: any
}

export type Ref<T> = { current: T }

// TODO!!!!
export type VirtualElement<P> =
  OpaqueType<'VirtualElement', { type: P, props?: any }>

export type VirtualNode =
  undefined | null | boolean | number | string | Iterable<any> | VirtualElement<any>

// ---

export type Boundary = OpaqueType<'Boundary'>

export type Fragment = OpaqueType<'Fragment'>

export declare function childCount(children: Children): number

export declare function component<P extends Props>(config: ComponentConfig<P>): Component<P>
export declare function component<P extends Props = {}>(displayName: string, renderer?: ComponentConfig<P>['render'], options?: ComponentOptions): Component<P>

export declare function context<T>(config: ContextConfig<T>): Context<T>
export declare function context<T>(displayName: string, defaultValue?: T, options?: ContextOptions): Context<T>

export declare function forEachChild(children: any, action: (child: any) => void): void

export declare function h<P extends Props>(type: string | Component<P>, ...children: any[]): VirtualElement<P>

export declare function isElement(it: any): boolean

export declare function mount(element: any, container: Element | string): void

export declare function toChildArray(children: Children): VirtualNode[]

export declare function unmount(container: Element | string): void

export declare function useCallback<T = void>(callback: (...args: any[]) => T, inputs?: any[]): (...args: any[]) => any

export declare function useContext<T>(ctx: Context<T>): T

export declare function useEffect(effect: () => void, inputs?: any[]): void

export declare function useForceUpdate(): (...args: any[]) => any

export declare function useImperativeHandle<M extends Methods>(ref: any, create: () => M, inputs?: any[]): void

export declare function usePrevious<T>(value: T): T | undefined

export declare function useRef<T>(initialValue?: T): {
  current: T
}

export declare function useState<T>(init: (() => T) | T): [T, (updater: (T | ((value: T) => T))) => void]

// --- locals -------------------------------------------------------

type OpaqueType<K extends string, T = {}> = T & { __TYPE__: K }
