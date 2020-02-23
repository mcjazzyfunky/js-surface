import { h, component, useEffect, useState }
  from '../../main/index'

const Demo = component({
  name: 'Demo',

  main() {
    const mousePosition = useMousePosition()

    return (
      !mousePosition
        ? <div>Please move mouse ...</div>
        : <div>
            Current mouse position: {mousePosition.x}x{mousePosition.y}
          </div>
    )
  }
})

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState(null)

  useEffect(() => {
    const listener = ev => {
      const
        x = ev.pageX,
        y = ev.pageY

      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', listener)

    return () => {
      window.removeEventListener('mousemove', listener)
    }
  }, [])

  return mousePosition
}

export default <Demo/>
