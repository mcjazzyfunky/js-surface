import useCallback from './useCallback'
import useState from './useState'

export default function () {
  const [state, setState] = useState(() => false)

  return useCallback(() => setState(it => !it), null)
}
