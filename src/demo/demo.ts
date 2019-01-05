import { defineComponent, defineContext } from '../modules/core/main/index'
import { mount } from '../modules/dom/main/index'
import { useState, useEffect, useProps, useContext } from '../modules/use/main/index'

import { div, button, label } from '../modules/html/main/index'

const TestCtx = defineContext<string>({
  displayName: 'TestCtx',
  defaultValue: 'Woohoo'
})

interface CounterProps {
  label: string
}

const Counter = defineComponent<CounterProps>({
  displayName: 'Counter',

  init(self) {
    const
      getProps = useProps(self, { label: 'Counter' }),
      getTest = useContext(self, TestCtx),
      [getCount, setCount] = useState(self, 0)

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
          getTest(),
          label(props.label),
          ': ',
          button({ onClick: onIncrement }, getCount()))
      )
   }
  }
})

mount(
    TestCtx.Provider({ value: 'xyz'},
    
    Counter()), document.getElementById('main-content'))
