/* @jsx createElement */
import { createElement, defineComponent } from '../../modules/core/main/index'
import { useCallback, useMethods, useRef, useState } from '../../modules/hooks/main/index'

type CounterProps = {
  label?: string,
  initialValue?: number
}

type CounterMethods = {
  reset(n: number): void
}

const Counter = defineComponent<CounterProps, CounterMethods>({
  displayName: 'Counter',

  defaultProps: {
    label: 'Counter',
    initialValue: 0
  },

  render(props, ref) {
    const
      [count, setCount] = useState(() => props.initialValue),
      onIncrement = useCallback(() => setCount(count + 1)),
      onDecrement = useCallback(() => setCount(count - 1))
    
    useMethods(ref, () => ({
      reset(n: number) {
        setCount(n)
      }
    }))


    return (
      <div>
        <label>{props.label}: </label>
        <button onClick={onDecrement}>-</button>
        {` ${count} `}
        <button onClick={onIncrement}>+</button>
      </div>
    )
  }
})

const App = defineComponent({
  displayName: 'App',

  render() {
    const
      counterRef = useRef<CounterMethods>(),
      onResetTo0 = useCallback(() => counterRef.current.reset(0)),
      onResetTo100 = useCallback(() => counterRef.current.reset(100))

    return (
      <div>
        <Counter ref={counterRef}/>
        <br/>
        <div>
          <button onClick={onResetTo0}>Set to 0</button>
          {' '}
          <button onClick={onResetTo100}>Set to 100</button>
        </div>
      </div>
    )
  }
})

export default <App/>
