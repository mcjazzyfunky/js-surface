/* @jsx createElement */
import { createElement, defineComponent } from '../../modules/core/main/index'


const SimpleCounter = defineComponent({
  displayName: 'SimpleCounter',

  render() {
    return 'SimpleCounter'
  }
})

export default SimpleCounter()
