import { createElement, defineComponent } from '../../modules/core/main'
import { init, hooks1 } from '../../modules/experimental/main'

const { useEffect, useState } = hooks1

type CounterProps = {
  label?: string,
  initialValue?: number
}

const Counter = defineComponent<CounterProps>({
  displayName: 'Clock',

  defaultProps: {
    label: 'Counter',
    initialValue: 0
  },

  render: init(c => {
    const
      [getCount, setCount] = useState(c, c.props.initialValue),
      onIncrement = () => setCount(getCount() + 1)

    useEffect(c, () => {
      console.log('Component did mount')
    }, () => [])

    useEffect(c, () => {
      console.log('Component did render')
    })

    return props => (
      <div>
        <label>{props.label}</label>
        {': '}
        <button onClick={onIncrement}>{getCount()}</button>
      </div>
    )
  })
})

export default <Counter/>
