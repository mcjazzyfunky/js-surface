/* @jsx createElement */
import { createElement, defineComponent } from '../../modules/core/main/index'
import { useCallback, useState } from '../../modules/hooks/main/index'

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

  render(props) {
    const
      [count, setCount] = useState(() => props.initialValue),
      onIncrement = useCallback(() => setCount(count + 1)),
      onDecrement = useCallback(() => setCount(count - 1))

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
    return (
      <div>
        <Counter/>
        <br/>
        <div>
          <button>Set to 0</button>
          {' '}
          <button>Set to 100</button>
        </div>
      </div>
    )
  }
})

export default <App/>
