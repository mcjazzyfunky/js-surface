import { VirtualElement } from '../modules/core/main/index'
import simpleCounter from './demos/simple-counter'
import complexCounter from './demos/complex-counter'
import i18n from './demos/i18n'
import customUses from './demos/custom-uses'

const demos: [string, VirtualElement][] = [
  ['Simple counter', simpleCounter],
  ['Complex counter', complexCounter],
  ['Internationalization', i18n],
  ['Custom "use*" functions', customUses]
]

export default demos
