import { VirtualElement } from '../modules/core/main/index'
import simpleCounter from './demos/simple-counter'
import i18n from './demos/i18n'

const demos: [string, VirtualElement][] = [
  ['Simple counter', simpleCounter],
  ['Internationalization', i18n]
]

export default demos
