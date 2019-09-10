import createElement from '../../api/createElement'
import Adapter from '../types/Adapter'

const adapter: Adapter = (createElement as any).__adapter

export default function getAdapter(): Adapter {
  return adapter
}
