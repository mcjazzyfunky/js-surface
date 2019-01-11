import { defineComponent, VirtualElement } from '../modules/core/main/index'
import { mount } from '../modules/dom/main/index'
import { useForceUpdate, useRef } from '../modules/hooks/main/index'
import { div, h3, h4, label, option, select } from '../modules/html/main/index'

import availableDemos from './available-demos'

// --- Component DemoSelector ---------------------------------------

type DemoSelectorProps = {
  demos: [string, VirtualElement][]
}

const DemoSelector = defineComponent<DemoSelectorProps>({
  displayName: 'DemoSelector',

  render(props) {
    const
      forceUpdate = useForceUpdate(),
      demoIdx = useRef(getCurrentDemoIndex())

    function startDemo(idx: number) {
      demoIdx.current = idx
      document.location.href = document.location.href.replace(/#.*$/, '') + '#idx=' + idx
      console.clear()
      forceUpdate()
    }

    const options = []

    for (let i = 0; i < props.demos.length; ++i) {
      const demo = props.demos[i]
          
      options.push(option({ key: i, value: i }, demo[0]))
    }

    return (
      div(null,
        div(null,
          label(null, 'Select experimental demo: '),
            select({
              onChange: (ev: any) => startDemo(ev.target.value),
              value: demoIdx.current,
              autoFocus: true
            }, options)),
            div(null,
              h4('Example: ', props.demos[demoIdx.current][0]),
              props.demos[demoIdx.current][1])))
  }
})

// --- Component Demo -----------------------------------------------

type DemoAppProps = {
  demos: [string, VirtualElement][]
}

const DemoApp = defineComponent<DemoAppProps>({
  displayName: 'DemoApp',

  render(props) {
    return (
      div(null,
        DemoSelector({ demos: props.demos }))
    )
  }
})

function getCurrentDemoIndex() {
  return parseInt(document.location.href.replace(/^.*idx=/, ''), 10) || 0
}

// --- main ---------------------------------------------------------

mount(DemoApp({ demos: availableDemos }), 'main-content')
