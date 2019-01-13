import Component from './types/Component'

export default function useEffect(c: Component, action: () => void, getDeps?: () => any[]) {
   return c.handleEffect(action, getDeps)
}
