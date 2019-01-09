/* @jsx createElement */
import { createElement, defineComponent } from '../../modules/core/main/index'
import { useEffect, useState } from '../../modules/hooks/main/index'

const Clock = defineComponent({
  displayName: 'Clock',

  render() {
    const
      [time, setTime] = useState(() => new Date().toLocaleTimeString())
  
    useEffect(() => {
      const id =
        setInterval(
          () => setTime(new Date().toLocaleTimeString()),
          100)

      return () => clearInterval(id)
    }, [])

    return (
      <div>
        Time: {time}
      </div>
    )
  }
})

export default <Clock/>
