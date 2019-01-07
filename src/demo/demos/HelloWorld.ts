import { createElement, defineComponent } from '../../modules/core/main/index'

const HelloWorld = defineComponent({
  displayName: 'HelloWorld',

  render() {
    return 'Hello'
  }
})

export default HelloWorld()
