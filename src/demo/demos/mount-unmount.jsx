import { h, component, useEffect, useImperativeHandle, useForceUpdate, useState }
  from '../../main/index'

const ComponentA = component({
  name: 'ComponentA',

  main({ componentRef }) {
    useImperativeHandle(componentRef, () => ({
      sayHello() {
        console.log('>> ComponentA says "Hello"')
      }
    }), [])

    useEffect(() => {
      console.log('Did mount ComponentA...')

      return () => console.log('Did unmount ComponentA')
    }, [])

    return <div>- - - ComponentA - - -</div>
  }
})

const ComponentB = component({
  name: 'ComponentB',

  main({ componentRef }) {
    useImperativeHandle(componentRef, () => ({
      sayHello() {
        console.log('ComponentB says "Hello"')
      }
    }), [])
    
    useEffect(() => {
      console.log('Did mount ComponentB...')

      return () => console.log('Did unmount ComponentB')
    }, [])

    return <div>- - - ComponentB - - -</div>
  }
})

const Demo = component({
  name: 'Demo',

  main() {
    const
      [state] = useState(() => ({ showComponentA: true })),
      forceUpdate = useForceUpdate()

    useEffect(() => {
      const intervalId = setInterval(() => {
        state.showComponentA = !state.showComponentA
        forceUpdate()
      }, 3000)

      return () => clearInterval(intervalId)
    }, [])

    return state.showComponentA 
      ? ComponentA({ componentRef: refCallback.bind(null, 'ComponentA') })
      : ComponentB({ componentRef: refCallback.bind(null, 'ComponentB') })
  }
})

function refCallback(type, ref) {
  console.log(`Invoked ref callback => ${type}: `, 'Ref:', ref)
  
  if (ref) {
    ref.sayHello()
  }
}

export default <Demo/>
