import {
  h, context, component, useEffect, useState
} from '../../main/index'

const CounterCtx = context({
  name: 'CounterCtx',
  defaultValue: 0
})

const ContextDemo = component({
  name: 'ContextDemo',

  main() {
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
  name: 'Output',
  memoize: true,

  main() {
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
