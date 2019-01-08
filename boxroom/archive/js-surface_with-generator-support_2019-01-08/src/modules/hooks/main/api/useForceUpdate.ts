import useCallback from './useCallback'
import useState from './useState'

export default function () {
  const [state, setState] = useState(() => null)

  return useCallback(() => setState(null))
}
