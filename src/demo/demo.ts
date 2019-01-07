import { defineComponent, defineContext } from '../modules/core/main/index'
import { mount } from '../modules/dom/main/index'
import { useCallback, useState, useEffect, usePrevious } from '../modules/hooks/main/index'
import { withDefaults } from '../modules/util/main/index'

//import { useState, useEffect, useProps, usePrevious } from '../modules/use/main/index'
//import { useState, useEffect, useProps, usePrevious, useContext } from '../modules/use2/main/index'

import { button, div, label } from '../modules/html/main/index'

const ThemeCtx = defineContext({
  displayName: 'ThemeCtx',
  defaultValue: 'white'
})

interface CounterProps {
  label: string
}

const Counter = defineComponent<CounterProps>({
  displayName: 'Counter',

  render(currProps) {
    const
      props = withDefaults(currProps, { label: 'Count' }),
      [count, setCount] = useState(() => 0),
      previousCount = usePrevious(count),
      onIncrement = useCallback(() => setCount(count + 1))

    useEffect(() => {
      console.log('Component did mount')
    }, [])

    useEffect(() => {
      console.log(`Component did render (`
        + `current counter value ${count}, `
        + `previously ${previousCount})`)
    })

    return (
      div(
        label(props.label),
        ': ',
        button({ onClick: onIncrement }, count))
    )
  }
})



/*
const Counter = defineComponent<CounterProps>({
  displayName: 'Counter',

  init(self) {
    const
      getProps = useProps(self, { label: 'Counter' }),
      [getCount, setCount] = useState(self, 0),
      getPreviousCount = usePrevious(self, getCount)

    useEffect(self, () => {
      console.log('Component did mount')
    }, () => [])

    useEffect(self, () => {
      console.log(`Component did render (`
        + `current counter value ${getCount()}, `
        + `previously ${getPreviousCount()})`)
    })

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
*/

/*
const Counter = defineComponent<CounterProps>({
  displayName: 'Counter',

  *init() {
    const
      getProps = yield useProps({ label: 'Counter' }),
      [getCount, setCount] = yield useState(0),
      getTheme = yield useContext(ThemeCtx),
      getPreviousCount = yield usePrevious(getCount)

    yield useEffect(() => {
      console.log('Component did mount')
    }, () => [])

    yield useEffect(() => {
      console.log(`Component did render (`
        + `current counter value ${getCount()}, `
        + `previously ${getPreviousCount()})`)
    })

    function onIncrement() {
      setCount(getCount() + 1)
    }

    return () => {
      const props = getProps()

      return (
        div(
          { style: { backgroundColor: getTheme() } },
          label(props.label),
          ': ',
          button({ onClick: onIncrement }, getCount()))
      )
   }
  }
})
*/

mount(Counter(), document.getElementById('main-content'))
