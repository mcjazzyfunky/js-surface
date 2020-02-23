import { h, component, render, useForceUpdate, useRef }
  from '../main/index'

import availableDemos from './available-demos'

// --- Component DemoSelector ---------------------------------------

const DemoSelector = component({
  name: 'DemoSelector',

  main(props) {
    const
      forceUpdate = useForceUpdate(),
      demoIdx = useRef(getCurrentDemoIndex())

    function startDemo(idx) {
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
            onChange={ev => startDemo(ev.target.value)}
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

const DemoApp = component({
  name: 'DemoApp',

  main(props) {
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

render(<DemoApp demos={availableDemos}/>, 'main-content')
