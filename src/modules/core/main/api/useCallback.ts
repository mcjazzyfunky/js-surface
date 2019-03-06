import useState from './useState'

export default function useCallback<T = void>(callback: (...args: any[]) => T, inputs?: any[]): (...args: any[]) => any {
  const [ret] = useState(() => function f(): any {
    return (f as any)._f.apply(null, arguments)
  }) as any

  ret._f = callback

  return ret
}
