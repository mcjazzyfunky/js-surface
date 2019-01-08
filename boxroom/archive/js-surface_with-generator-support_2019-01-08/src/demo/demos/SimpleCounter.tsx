import { defineComponent } from '../../modules/core/main/index'
import { useCallback, useState } from '../../modules/hooks/main/index'
import { button, div, label } from '../../modules/html/main/index'

interface SimpleCounterProps {
  label?: string,
  initialValue?: number
}

const SimpleCounter = defineComponent<SimpleCounterProps>({
  displayName: 'SimpleCounter',

  defaultProps: {
    label: 'Counter',
    initialValue: 0
  },

  render(props) {
    const
      [count, setCount] = useState(() => props.initialValue),
      onIncrement = useCallback(() => setCount(count + 1))

    return (
      div(null,
        label(null, props.label + ': '),
        button({ onClick: onIncrement }, count))
    )
  }
})

export default SimpleCounter()
