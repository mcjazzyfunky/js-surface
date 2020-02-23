import { h, component, useCallback, useEffect, useState }
 from '../../main/index'

const Counter = component({
  name: 'Counter',

  main({ initialValue = 0, label = 'Counter' }) {
    const
      [count, setCount] = useState(() => initialValue),
      onIncrement = useCallback(() => setCount(count + 1), [count])

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
