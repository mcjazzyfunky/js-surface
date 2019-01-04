import { createElement as h, defineComponent } from '../modules/core/main/index'
import { mount } from '../modules/dom/main/index'

mount(h('div', 12345), document.getElementById('main-content'))