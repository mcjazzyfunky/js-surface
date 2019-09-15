import {
  h, context, component, useEffect, useState
} from '../../main/index'

const CounterCtx = context({
  displayName: 'CounterCtx',
  defaultValue: 0
})

const ContextDemo = component({
  displayName: 'ContextDemo',

  render() {
    const [count, setCount] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setCount(count => count + 1)
      }, 1000)

      return () => clearInterval(interval)
    }, [])

    return (
      <CounterCtx.Provider value={count}>
        <Output/>
      </CounterCtx.Provider>
    )
  }
})

const Output = component({
  displayName: 'Output',
  memoize: true,

  render() {
    return (
      <div>
        <div>
          Last update: {new Date().toLocaleTimeString()}
        </div>
        <CounterCtx.Consumer>
          {count => `Current counter value: ${count}`}
        </CounterCtx.Consumer>
      </div>
    )
  }
})

export default <ContextDemo/>
