import { createElement as h, defineComponent }  from '../../modules/core/main/index'
import { useRef, useState } from '../../modules/hooks/main'

const StopWatch = defineComponent({
  displayName: 'StopWatch',

  render(props) {
    const
      timerIdRef = useRef(null),
      [time, setTime] = useState(() => 0),
      [isRunning, setRunning] = useState(() => false)
    
    function startTimer() {
      if (!isRunning) {
        const startTime = Date.now() - time

        timerIdRef.current = setInterval(() => {
          setTime(Date.now() - startTime)
        }, 10)

        setRunning(true)
      }
    }

    function stopTimer() {
      if (isRunning) {
        clearInterval(timerIdRef.current)
        timerIdRef.current = null
        setRunning(false)
      }
    }

    function resetTimer() {
      stopTimer()
      setTime(0)
    }

    function onWillUnmount() {
      stopTimer()
    }

    const bind = {
      startStopButton: {
        onClick: () => {
          if (isRunning) {
            stopTimer()
          } else {
            startTimer()
          }
        }
      },

      resetButton: {
        onClick: () => {
          resetTimer()
        }
      }
    }

    return (
      h('div', null,
        h('div', null,
        `Time: ${time} `),
        h('br'),
        h('div',
          h('button',
            { ...bind.startStopButton },
            isRunning ? 'Stop' : 'Start'),
          ' ',
          h('button',
            { ...bind.resetButton },
            'Reset')))
    )
  }
})

export default StopWatch()