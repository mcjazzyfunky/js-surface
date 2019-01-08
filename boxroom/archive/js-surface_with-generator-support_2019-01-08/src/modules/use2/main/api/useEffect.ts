export default function* useEffect(action: () => (void | null | (() => void)), getInputs?: () => any[]) {
  if (!getInputs) {
    let cleanup: Function | void = null

    const listener = () => {
      if (cleanup) {
        cleanup()
      }

      cleanup = action()
    }

    yield {
      type: 'handleLifecycle',
      event: 'didMount',
      callback: listener
    }

    yield {
      type: 'handleLifecycle',
      event: 'didUpdate',
      callback: listener 
    }

    yield {
      type: 'handleLifecycle',
      event: 'willUnmount',

      callback() {
        if (cleanup) {
          cleanup()
        }
      }
    }
  } else {
    let
      cleanup: any,
      oldInputs: any[]

    const callback = () => {
      const inputs = getInputs()

      if (!Array.isArray(inputs)) {
        throw new TypeError(
          '[useEffect] Optional third parameter "getInputs" must be a function that returns an array')
      }

      if (!isEqual(inputs, oldInputs)) {
        if (cleanup) {
          cleanup()
        }

        oldInputs = inputs
        cleanup = action()
      }
    }

    yield {
      type: 'handleLifecycle',
      event: 'didMount',
      callback
    }

    yield {
      type: 'handleLifecycle',
      event: 'didUpdate',
      callback
    }

    yield {
      type: 'handleLifecycle',
      event: 'willUnmount',

      callback() {
        if (cleanup) {
          cleanup()
        }
      }
    }
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