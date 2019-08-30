import {
  createElement,
  component,
  useCallback,
  useImperativeMethods,
  useRef,
  useState,
  Ref
} from '../../modules/core/main/index'

type CounterProps = {
  label?: string,
  initialValue?: number,
  componentRef?: Ref<CounterMethods>
}

type CounterMethods = {
  reset(n: number): void
}

const Counter: any = component<CounterProps>({
  displayName: 'Counter',

  render({ initialValue = 0, label = 'Counter', componentRef }) {
    const
      [count, setCount] = useState(() => initialValue),
      onIncrement = useCallback(() => setCount(count + 1)),
      onDecrement = useCallback(() => setCount(count - 1))

    useImperativeMethods(componentRef, () => ({
      reset(n: number) {
        setCount(n)
      }
    }), [])

    return (
      <div>
        <label>{label}: </label>
        <button onClick={onDecrement}>-</button>
        {` ${count} `}
        <button onClick={onIncrement}>+</button>
      </div>
    )
  }
})

const App: any = component({
  displayName: 'App',

  render() {
    const
      counterRef = useRef<CounterMethods>(),
      onResetTo0 = useCallback(() => counterRef.current.reset(0)),
      onResetTo100 = useCallback(() => counterRef.current.reset(100))

    return (
      <div>
        <Counter componentRef={counterRef}/>
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
