import Component from './Component'
import OpaqueType from '../../internal/types/OpaqueType'

// TODO!!!!
type VirtualElement<P> =
  OpaqueType<'VirtualElement', { type: P, props?: any }>

export default VirtualElement
