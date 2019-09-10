// internal imports
import Props from './Props'
import OpaqueType from '../../internal/types/OpaqueType'

// --- Component ----------------------------------------------------

type Component<P extends Props> = OpaqueType<'Component'>

// --- exports ------------------------------------------------------

export default Component
