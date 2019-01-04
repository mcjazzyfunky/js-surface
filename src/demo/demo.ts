import { createElement as h, defineComponent } from '../modules/core/main/index'
import { mount } from '../modules/dom/main/index'
import { useState } from '../modules/use/main/index'

import { div, button, label } from '../modules/html/main/index'

const Counter = defineComponent({
  displayName: 'Test',

  init(self) {
    let [getCount, setCount] = useState(self, 0)

    function onIncrement() {
      setCount(getCount() + 1)
    }

    return () => {
      return (
        div(
          label('Counter: '),
          button({ onClick: onIncrement }, getCount()))
      )
    }
  }
})

console.log(Counter())

mount(Counter(), document.getElementById('main-content'))