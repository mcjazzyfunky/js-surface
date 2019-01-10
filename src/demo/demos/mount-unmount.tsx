import { createElement, defineComponent } from '../../modules/core/main/index'
import { useEffect, useState, useMethods } from '../../modules/hooks/main/index';

type Methods = {
  sayHello: () => void
}

const ComponentA = defineComponent({
  displayName: 'ComponentA',

  render(_, ref) {
    useMethods(ref, () => ({
      sayHello() {
        console.log('>> ComponentA says "Hello"')
      }
    }))

    useEffect(() => {
      console.log('Did mount ComponentA...')

      return () => console.log('Did unmount ComponentA')
    }, [])

    return <div>- - - ComponentA - - -</div>
  }
})

const ComponentB = defineComponent({
  displayName: 'ComponentB',

  render(_, ref) {
    useMethods(ref, () => ({
      sayHello() {
        console.log('ComponentB says "Hello"')
      }
    }))
    
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
      ? ComponentA({ ref: refCallback.bind(null, 'ComponentA') })
      : ComponentB({ ref: refCallback.bind(null, 'ComponentB') })
  }
})

function refCallback(type: string, ref: any) {
  console.log(`Invoked ref callback => ${type}: `, 'Ref:', ref)
  
  if (ref) {
    ref.sayHello()
  }
}

export default Demo()
