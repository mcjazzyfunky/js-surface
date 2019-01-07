import { defineComponent, defineContext, VirtualElement } from '../modules/core/main/index'
import { mount } from '../modules/dom/main/index'
import { useForceUpdate, useRef } from '../modules/hooks/main/index'
import { br, div, label, option, select } from '../modules/html/main/index'

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
      demoIdx = useRef(parseInt(document.location.href.replace(/^.*idx=/, ''), 10) || 0)

    function startDemo(idx: number) {
      demoIdx.current = idx
      document.location.href = document.location.href.replace(/#.*$/, '') + '#idx=' + idx
      forceUpdate()
    }

    const options = []

    for (let i = 0; i < props.demos.length; ++i) {
      const demo = props.demos[i]
          
      options.push(option({ key: i, value: i }, demo[0]))
    }

    return (
      div(
        div(
          label('Select demo: '),
            select({
              onChange: (ev: any) => startDemo(ev.target.value),
              value: demoIdx.current,
              autoFocus: true
            }, options)),
            br(),
            div(props.demos[demoIdx.current][1])))
  }
})

// --- Component Demo -----------------------------------------------

type DemoProps = {
  demos: [string, VirtualElement][]
}

const Demo = defineComponent<DemoProps>({
  displayName: 'Demo',

  render(props) {
    return (
      div(
        div(
          DemoSelector({ demos: props.demos })))
    )
  }
})

// --- main ---------------------------------------------------------

mount(Demo({ demos: availableDemos }), document.getElementById('main-content'))
