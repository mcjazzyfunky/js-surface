import {
  createElement, defineContext, defineComponent, useEffect, useState
} from '../../modules/core/main/index'

const CounterCtx = defineContext({
  displayName: 'CounterCtx',
  defaultValue: 0
})

const ContextDemo = defineComponent({
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

const Output = defineComponent({
  displayName: 'Output',
  memoize: true,

  render() {
    return (
      <div>
        <div>
          Last update: {new Date().toLocaleTimeString()}
        </div>
        <CounterCtx.Consumer>
          {(count: number) => `Current counter value: ${count}`}
        </CounterCtx.Consumer>
      </div>
    )
  }
})

export default <ContextDemo/>
