import Component from './types/Component'
import useState from './useState';

export default function useForceUpdate<T>(c: Component): () => void {
   const [, setDummy] = useState(c, null)

   return () => setDummy(null)
}
