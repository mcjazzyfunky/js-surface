import { createElement as h, defineComponent } from '../modules/core/main/index'
import { mount } from '../modules/dom/main/index'
import { useState, useEffect, useProps } from '../modules/use/main/index'

import { div, button, label } from '../modules/html/main/index'

interface CounterProps {
  label: string
}

const Counter = defineComponent<CounterProps>({
  displayName: 'Test',

  init(self) {
    const getProps = useProps(self, { label: 'Counter' })

    let [getCount, setCount] = useState(self, 0)

    useEffect(self, () => {
      console.log('Component did render')
    })

    useEffect(self, () => {
      console.log('Component did mount')
    }, () => [])

    function onIncrement() {
      setCount(getCount() + 1)
    }

    return () => {
      const props = getProps()

      return (
        div(
          label(props.label),
          ': ',
          button({ onClick: onIncrement }, getCount()))
      )
    }
  }
})

mount(Counter(), document.getElementById('main-content'))
