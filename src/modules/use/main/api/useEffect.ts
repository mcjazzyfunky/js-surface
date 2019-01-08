import { Component } from '../../../core/main/index'

export default function useEffect(c: Component, action: () => (void | (() => void)), getInputs?: () => any[]) {
  if (!getInputs) {
    let cleanup: void | (() => void)

    const listener = () => {
      if (cleanup) {
        cleanup()
      }

      cleanup = action()
    }

    c.onDidMount(listener)
    c.onDidUpdate(listener)

    c.onWillUnmount(() => {
      if (cleanup) {
        cleanup
      }
    })
  } else {
    let
      cleanup: void | (() => void),
      oldInputs: any[]

    const listener = () => {
      const inputs = getInputs()

      if (!Array.isArray(inputs)) {
        throw new TypeError(
          '[useEffect] Optional third parameter "getInputs" must be a function that returns an array')
      }

      if (!isEqual(inputs, oldInputs)) {
        oldInputs = inputs

        if (cleanup) {
          cleanup()
        }

        cleanup = action()
      }
    }

    c.onDidMount(listener)
    c.onDidUpdate(listener)
    
    c.onWillUnmount(() => {
      if (cleanup) {
        cleanup()
      }
    })
  }
}

// --- locals -------------------------------------------------------

function isEqual(arr1: any[], arr2: any[]):  boolean {
  let ret = Array.isArray(arr1) && Array.isArray(arr2) && arr1.length === arr2.length

  if (ret) {
    for (let i = 0; i < arr1.length; ++i) {
      if (arr1[i] !== arr2[i]) {
        ret = false
        break
      }
    }
  }

  return ret
}