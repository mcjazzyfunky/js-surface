import { createElement, defineComponent } from '../../modules/core/main'
import { createRef, init, useMethods, useState } from '../../modules/experimental/main'

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

  render: init((c, ref) => {
    const
      [getCount, setCount] = useState(c, c.props.initialValue),
      onIncrement = () => setCount(getCount() + 1),
      onDecrement = () => setCount(getCount() - 1)

    useMethods(c, ref, () => ({
      reset(n: number) {
        setCount(n)
      }
    }))

    return props => 
      <div>
        <label>{props.label}: </label>
        <button onClick={onDecrement}>-</button>
        {` ${getCount()} `}
        <button onClick={onIncrement}>+</button>
      </div>
  })
})

const App = defineComponent({
  displayName: 'App',

  render: init(c => {
    const
      counterRef = createRef(),
      onResetTo0 = () => counterRef.current.reset(0),
      onResetTo100 = () => counterRef.current.reset(100)

    return () => (
      <div>
        <Counter ref={counterRef} />
        <br/>
        <div>
          <button onClick={onResetTo0}>Set to 0</button>
          {' '}
          <button onClick={onResetTo100}>Set to 100</button>
        </div>
      </div>
    )
  })
})

export default <App/>
