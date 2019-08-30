import Props from './Props'

type Component<P extends Props> = unknown & { __opaqueType__: 'component' }

export default Component
