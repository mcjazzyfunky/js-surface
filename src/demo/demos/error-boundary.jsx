import {
  h,
  component,
  useCallback,
  useState,
  Boundary
} from '../../main/index'; 

const ErrorTrigger = component({
  displayName: 'ErrorTrigger',

  render() {
    const
      [errorMsg, setErrorMsg] = useState(null),
      onButtonClick = useCallback(() => setErrorMsg('Simulated error!'), [])

    if (errorMsg) {
      throw new Error(errorMsg);
    }

    return (
      <button onClick={onButtonClick}>
        Click to trigger errror
      </button>
    )
  }
})

const ErrorBoundary = component({
  displayName: 'ErrorBoundary',

  render(props) {
    const
      [error, setError] = useState(null),
      
      handleReset = useCallback(() => {
        setError(null)
      }, []),

      handleError = useCallback((error, info) => {
        console.log(error)
        console.log('Error info: ', info)
        setError(error)
      }, [])

    return (
      <Boundary fallback={handleError}>
        {
          error
            ? <div>
                Catched error: <i>{error.message} </i>
                <button onClick={handleReset}>Reset</button>
              </div>
            : <ErrorTrigger/>
        }
      </Boundary>
    )
  }
})

export default <ErrorBoundary/>
