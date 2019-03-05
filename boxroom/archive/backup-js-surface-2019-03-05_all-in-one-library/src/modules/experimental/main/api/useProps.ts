import Component from './types/Component'
import { Props } from '../../../core/main'

export default function useProps<P extends Props>(c: Component<P>) {
  return () => c.props
}
