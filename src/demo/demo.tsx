import { createElement, component, mount, VirtualNode, useForceUpdate, useRef }
  from '../modules/core/main/index'

import '../modules/adapt-preact/main/index'
import availableDemos from './available-demos'

// --- Component DemoSelector ---------------------------------------

type DemoSelectorProps = {
  demos: [string, VirtualNode][]
}

const DemoSelector: any = component<DemoSelectorProps>({
  displayName: 'DemoSelector',

  render(props) {
    const
      forceUpdate = useForceUpdate(),
      demoIdx = useRef(getCurrentDemoIndex())

    function startDemo(idx: number) {
      demoIdx.current = idx
      document.location.href = document.location.href.replace(/#.*$/, '') + '#idx=' + idx
      console.clear()
      
      console.log('start demo', idx)
      forceUpdate()
    }

    const options = []

    for (let i = 0; i < props.demos.length; ++i) {
      const demo = props.demos[i]
          
      options.push(<option key={i} value={i}>{demo[0]}</option>)
    }

    return (
      <div>
        <div>
          <label>Select demo: </label>
          <select
            onChange={(ev: any) => startDemo(ev.target.value)}
            value={demoIdx.current}
            autoFocus={true}
          >
            {options}
          </select>
          <div>
            <h4>Example: {props.demos[demoIdx.current][0]}</h4>
            {props.demos[demoIdx.current][1]}
          </div>
        </div>
      </div>
    )
  }
})

// --- Component Demo -----------------------------------------------

type DemoAppProps = {
  demos: [string, VirtualNode][]
}

const DemoApp: any = component<DemoAppProps>({
  displayName: 'DemoApp',

  render(props) {
    return (
      <div>
        <DemoSelector demos={props.demos}/>
      </div>
    )
  }
})

function getCurrentDemoIndex() {
  return parseInt(document.location.href.replace(/^.*idx=/, ''), 10) || 0
}

// --- main ---------------------------------------------------------

mount(<DemoApp demos={availableDemos}/>, 'main-content')
