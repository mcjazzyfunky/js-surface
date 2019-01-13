import { createElement, defineComponent } from '../../modules/core/main'
import { init, useData, useEffect, useProps, useState, Component } from '../../modules/experimental/main'

const Demo = defineComponent({
  displayName: 'Demo',

  render: init(c => {
    let 
      [props, prevProps] = useData(c, useProps(c),
        (a, b) => { props = a, prevProps = b }),

      [data, prevData] = useData(c, { 
        time: useTime(c, 1000),
        mousePos: useMousePos(c)
      }, (a, b) => { data = a, prevData = b })

    return () => ( 
      <div>
        <div>Time: {data.time.toLocaleTimeString()}</div>
        <div>Mouse: {data.mousePos || <i>please move mouse...</i>}</div>
      </div>
    )
  })
})

export default <Demo/>

function useTime(c: Component, millis: number): () => Date {
  let
    intervalId: any = null,
    [getTime, setTime] = useState(c, new Date)

  useEffect(c, () => {
    intervalId = setInterval(() => {
      setTime(new Date)
    }, millis)

    return () => {
      clearInterval(intervalId)
    }
  }, (): any => [])

  return getTime
}

function useMousePos(c: Component) {
  const [getPos, setPos] = useState(c, null as any) 

  useEffect(c, () => {
    const listener = (ev: any) => {
      const
        x = ev.pageX,
        y = ev.pageY

      setPos({ x, y })
    }

    window.addEventListener('mousemove', listener)

    return () => {
      window.removeEventListener('mousemove', listener)
    }
  }, () => [])

  return getPos
}

