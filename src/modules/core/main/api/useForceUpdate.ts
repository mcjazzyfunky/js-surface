import useCallback from './useCallback'
import useState from './useState'

export default function () {
  const
    useCallback2 = (useCallback as any).__apply,
    useState2 = (useState as any).__apply
  
  if (!useCallback2 || !useState2) {
    throw new Error('[useForceUpdate] Adapter has not been initialized')
  }

  const [state, setState] = useState2(() => false)

  return useCallback2(() => setState((it: any) => !it), null)
}
