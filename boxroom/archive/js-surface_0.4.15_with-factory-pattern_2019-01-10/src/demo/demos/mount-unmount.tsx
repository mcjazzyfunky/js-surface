import { createElement, defineComponent } from '../../modules/core/main/index'
import { useEffect, useState } from '../../modules/hooks/main/index';

const ComponentA = defineComponent({
  displayName: 'ComponentA',

  render() {
    useEffect(() => {
      console.log('Did mount ComponentA...')

      return () => console.log('Did unmount ComponentA')
    }, [])

    return <div>- - - ComponentA - - -</div>
  }
})

const ComponentB = defineComponent({
  displayName: 'ComponentB',

  render() {
    useEffect(() => {
      console.log('Did mount ComponentB...')

      return () => console.log('Did unmount ComponentB')
    }, [])

    return <div>- - - ComponentB - - -</div>
  }
})

const Demo = defineComponent({
  displayName: 'Demo',

  render() {
    const
      [state, setState] = useState(() => ({ showComponentA: true }))

    useEffect(() => {
      const intervalId = setInterval(() => {
        state.showComponentA = !state.showComponentA
        setState(state)
      }, 3000)

      return () => clearInterval(intervalId)
    }, [])

    return state.showComponentA 
      ? ComponentA({ ref: printRefCallbackInfo.bind(null, 'ComponentA') })
      : ComponentB({ ref: printRefCallbackInfo.bind(null, 'ComponentB') })
  }
})

function printRefCallbackInfo(type: string, ref: any) {
  console.log(`Invoked ref callback - ${type}: `, String(ref))
}

export default Demo()
