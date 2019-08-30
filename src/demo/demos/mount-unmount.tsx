import { createElement, component, useEffect, useImperativeMethods, useForceUpdate, useState }
  from '../../modules/core/main/index'

type Methods = {
  sayHello: () => void
}

type ABProps = {
  componentRef: any // TODO
}

const ComponentA: any = component<ABProps>({ // TODO
  displayName: 'ComponentA',

  render({ componentRef }) {
    useImperativeMethods(componentRef, () => ({
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

const ComponentB: any = component<ABProps>({ // TODO
  displayName: 'ComponentB',

  render({ componentRef }) {
    useImperativeMethods(componentRef, () => ({
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

const Demo: any = component({ // TODO
  displayName: 'Demo',

  render() {
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

function refCallback(type: string, ref: any) {
  console.log(`Invoked ref callback => ${type}: `, 'Ref:', ref)
  
  if (ref) {
    ref.sayHello()
  }
}

export default <Demo/>
