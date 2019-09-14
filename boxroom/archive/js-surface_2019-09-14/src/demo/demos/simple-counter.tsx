import { h, component, useCallback, useEffect, useState }
 from '../../main/js-surface'

type CounterProps = {
  label?: string,
  initialValue?: number
}

const Counter: any = component<CounterProps>({ // TODO
  displayName: 'Counter',

  render({ initialValue = 0, label = 'Counter' }) {
    const
      [count, setCount] = useState(() => initialValue),
      onIncrement = useCallback(() => setCount(count + 1))

    useEffect(() => {
      console.log('Component has been mounted')
    }, [])

    useEffect(() => {
      console.log('Component has been rendered')
    })
    

    return (
      <div>
        <label>{label} </label>
        <button onClick={onIncrement}>{count}</button>
      </div>
    )
  }
})

export default <Counter/>
