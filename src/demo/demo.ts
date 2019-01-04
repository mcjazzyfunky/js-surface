import { createElement as h, defineComponent } from '../modules/core/main/index'
import { mount } from '../modules/dom/main/index'


const Test = defineComponent({
  displayName: 'Test',

  render: () => {
    return h('div', 'Juhu')
  }
})

console.log(Test)

mount(Test(), document.getElementById('main-content'))