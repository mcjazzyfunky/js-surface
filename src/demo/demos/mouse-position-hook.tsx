import { createElement, component, useEffect, useState }
  from '../../modules/core/main/index'

const Demo: any = component({
  displayName: 'Demo',

  render() {
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
  const [mousePosition, setMousePosition] = useState(() => (null as { x: number, y: number }))

  useEffect(() => {
    const listener = (ev: any) => {
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
