import { h, component, useEffect, useState } from '../../main/index'

const Clock = component({
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
