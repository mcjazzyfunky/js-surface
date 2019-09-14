import Props from './Props'
import VirtualNode from './VirtualNode'

type ComponentConfig<P extends Props> = {
  displayName: string,
  forwardRef?: boolean,
  memoize?: boolean,
  validate?(props: P): boolean | null | Error
  render(props: P): VirtualNode
}

export default ComponentConfig