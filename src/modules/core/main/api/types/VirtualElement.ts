import Props from './Props'

type VirtualElement<P extends Props> = unknown & { __opaqueType__: 'element' }

export default VirtualElement
